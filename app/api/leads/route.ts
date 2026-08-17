import { NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/validation";
import { appendLeadToGoogleSheet } from "@/lib/google-sheets";
import { sendLeadToAppsScriptSheet } from "@/lib/apps-script-sheets";
import { getSupabaseServer } from "@/lib/supabase/server";
import { classifyTimeframeLeadTemperature } from "@/lib/lead-temperature";
import { buildConsultationGhlPayload } from "@/lib/ghl-webhook";

/**
 * POST /api/leads
 *
 * Receives consultation-request submissions from components/LeadForm.tsx.
 * Validates, logs server-side, and appends the lead to Google Sheets via a
 * Google Apps Script web app (see lib/apps-script-sheets.ts — this is the
 * active integration; see README "Connect Google Sheets (Apps Script)").
 * lib/google-sheets.ts (a direct service-account integration) is also
 * wired in as a no-op fallback in case that path becomes usable later.
 * Wire up additional destinations before going live — see the TODO block
 * below.
 *
 * Never expose webhook URLs, API keys, or CRM credentials in client-side
 * code. Any secret used here should be read from process.env on the server
 * and listed (without its value) in .env.example.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = leadFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", issues: result.error.issues },
      { status: 400 }
    );
  }

  const lead = result.data;

  // Honeypot check: if the hidden "companyWebsite" field was filled in,
  // this was almost certainly a bot. Respond as if it succeeded (so the bot
  // doesn't learn its submission was rejected) but drop the data silently.
  if (lead.companyWebsite) {
    return NextResponse.json({ ok: true });
  }

  // This form is for marketing intake only — do not add medical history,
  // diagnosis, or health-condition fields to leadFormSchema or log them here.

  console.log("[leads] New consultation request:", {
    name: `${lead.firstName} ${lead.lastName}`,
    email: lead.email,
    phone: lead.phone,
    preferredContact: lead.preferredContact,
    serviceInterest: lead.serviceInterest,
    timeframe: lead.timeframe,
    mainGoal: lead.mainGoal,
    source: lead.source,
    campaign: lead.campaign,
    pageUrl: lead.pageUrl,
    submittedAt: lead.submittedAt,
    utm: {
      source: lead.utmSource,
      medium: lead.utmMedium,
      campaign: lead.utmCampaign,
      term: lead.utmTerm,
      content: lead.utmContent,
    },
  });

  // Lead temperature is computed once (via the canonical classifier in
  // lib/lead-temperature.ts) and reused for both Supabase and the GHL
  // webhook below, so they can never disagree with each other. Returns
  // "unknown" — never a silent fallback to "nurture" — for a missing or
  // unrecognized timeframe value.
  const leadTemp = classifyTimeframeLeadTemperature(lead.timeframe);

  if (leadTemp === "unknown") {
    // In practice this shouldn't happen — leadFormSchema's `timeframe`
    // field is a strict Zod enum of the 4 known dropdown options, so
    // anything else is already rejected before this point. Logged anyway
    // as a defensive signal. No PII (name/email/phone) included.
    console.warn("[leads] Unexpected unknown lead temperature", {
      route: "/api/leads",
      invalidTimeframe: lead.timeframe ?? null,
      reason: "leadTemp resolved to 'unknown' — check classifyTimeframeLeadTemperature for a gap, or whether leadFormSchema's timeframe enum changed without updating lib/lead-temperature.ts.",
    });
  }

  // Save to Supabase
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase.from("leads").insert({
        first_name: lead.firstName,
        email: lead.email,
        phone: lead.phone || null,
        service_interest: lead.serviceInterest || null,
        lead_source: lead.source || "direct",
        utm_source: lead.utmSource || null,
        utm_medium: lead.utmMedium || null,
        utm_campaign: lead.utmCampaign || null,
        utm_content: lead.utmContent || null,
        lead_temp: leadTemp,
        marketing_consent: true,
        status: "new",
        quiz_answers: { _form_submission: true, mainGoal: lead.mainGoal },
      });
    } catch (err) {
      console.error("[leads] Supabase insert error:", err);
    }
  }

  // Google Sheets via Apps Script web app — the active integration. No-ops
  // with a console warning until GOOGLE_APPS_SCRIPT_URL is set — see
  // .env.example and README "Connect Google Sheets (Apps Script)".
  try {
    await sendLeadToAppsScriptSheet(lead);
  } catch (err) {
    console.error("[apps-script] Failed to send lead:", err);
  }

  // Google Sheets via a direct service-account integration — kept wired in
  // as a no-op fallback (GOOGLE_SHEETS_* env vars are unset), in case that
  // path becomes usable later (e.g. an org policy blocking key creation is
  // lifted). See lib/google-sheets.ts.
  try {
    await appendLeadToGoogleSheet(lead);
  } catch (err) {
    console.error("[google-sheets] Failed to append lead:", err);
  }

  // GoHighLevel webhook
  if (process.env.GHL_WEBHOOK_URL) {
    try {
      const ghlPayload = buildConsultationGhlPayload({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        serviceInterest: lead.serviceInterest || "",
        timeframe: lead.timeframe,
        mainGoal: lead.mainGoal || "",
        source: lead.source || "website",
        utmSource: lead.utmSource || "",
        utmMedium: lead.utmMedium || "",
        utmCampaign: lead.utmCampaign || "",
        leadTemp,
      });
      await fetch(process.env.GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ghlPayload),
      });
    } catch (err) {
      console.error("[ghl] Webhook error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
