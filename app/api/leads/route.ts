import { NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/validation";
import { appendLeadToGoogleSheet } from "@/lib/google-sheets";
import { sendLeadToAppsScriptSheet } from "@/lib/apps-script-sheets";

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

  // Both integrations above are wrapped in try/catch so an outage on
  // either one never blocks the visitor's success response — the lead is
  // still captured in the server log above either way.

  // ---------------------------------------------------------------------
  // TODO: Connect any additional destinations for the validated `lead`
  // object above. Keep all secrets in server-only environment variables
  // (see .env.example) — never in NEXT_PUBLIC_* variables, which are
  // bundled into client-side JS.
  //
  // 1) ZAPIER WEBHOOK (not currently used — see lib/zapier.ts if you want
  //    to revisit it; requires a paid Zapier plan for the Webhooks trigger)
  //    await sendLeadToZapier(lead);
  //
  // 2) CRM (e.g. HubSpot, GoHighLevel, custom)
  //    await fetch(`${process.env.CRM_API_URL}/contacts`, {
  //      method: "POST",
  //      headers: {
  //        "Content-Type": "application/json",
  //        Authorization: `Bearer ${process.env.CRM_API_KEY}`,
  //      },
  //      body: JSON.stringify(lead),
  //    });
  //
  // 3) EMAIL SERVICE (e.g. Resend, SendGrid, Postmark)
  //    await resend.emails.send({
  //      from: "leads@dessidollhouse.com",
  //      to: "team@dessidollhouse.com",
  //      subject: `New consultation request: ${lead.firstName} ${lead.lastName}`,
  //      text: JSON.stringify(lead, null, 2),
  //    });
  // ---------------------------------------------------------------------

  return NextResponse.json({ ok: true });
}
