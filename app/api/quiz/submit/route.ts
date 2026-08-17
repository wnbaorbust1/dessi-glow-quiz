/**
 * POST /api/quiz/submit
 *
 * Receives completed quiz + lead capture data.
 * Validates, stores in Supabase (if configured), sends emails, and returns
 * the computed quiz result and lead ID.
 *
 * All secrets are server-only environment variables.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreQuiz } from "@/lib/quiz-scoring";
import { validateQuizQ5Answer } from "@/lib/lead-temperature";
import { buildQuizGhlPayload } from "@/lib/ghl-webhook";
import { getSupabaseServer } from "@/lib/supabase/server";
import { sendQuizResultEmail, sendTeamNotification } from "@/lib/email";
import { sendLeadToGoogleSheets } from "@/lib/google-sheets-quiz";

const submitSchema = z
  .object({
    // Lead capture fields
    firstName: z.string().trim().min(1).max(80),
    email: z.string().trim().email(),
    phone: z.string().trim().max(20).optional().default(""),
    zip: z.string().trim().max(10).optional().default(""),
    marketingConsent: z.boolean().default(false),

    // Quiz answers: { questionId: [answerId, ...] }
    answers: z.record(z.string(), z.array(z.string())),
    // Optional free-text write-in answers (not scored)
    writeIns: z.record(z.string(), z.string()).optional().default({}),

    // Attribution
    utmSource: z.string().max(200).optional().default(""),
    utmMedium: z.string().max(200).optional().default(""),
    utmCampaign: z.string().max(200).optional().default(""),
    utmContent: z.string().max(200).optional().default(""),
    refCode: z.string().max(100).optional().default(""),
    sessionId: z.string().max(100).optional().default(""),

    // Honeypot
    website: z.string().max(0).optional().or(z.literal("")),
  })
  // Backend validation for Q5 (the lead-temperature question) — do not
  // rely on the frontend's radio-button behavior alone. Rejects malformed
  // submissions outright rather than silently classifying them as
  // "education" or any other bucket. Skipped for honeypot submissions
  // (bots rarely produce a well-formed answers object, and there's no
  // value in surfacing validation detail to them) — the honeypot check
  // below runs after parsing either way, so a flagged submission is
  // dropped regardless of what this reports.
  .superRefine((data, ctx) => {
    if (data.website) return; // honeypot — let it through parsing, drop it after
    const error = validateQuizQ5Answer(data.answers["q5"]);
    if (error) {
      ctx.addIssue({ code: "custom", path: ["answers", "q5"], message: error });
    }
  });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot check
  if (data.website) {
    return NextResponse.json({ ok: true, leadId: null });
  }

  // Score the quiz
  const scoring = scoreQuiz(data.answers);

  // Lead temperature is computed once by scoreQuiz() (via the canonical
  // classifier in lib/lead-temperature.ts) and reused everywhere below —
  // Supabase, Google Sheets, emails, and the GHL webhook all read this
  // same constant, so they can never disagree with each other.
  const leadTemp = scoring.leadTemp;

  if (leadTemp === "unknown") {
    // Should not be reachable in practice — the superRefine check above
    // rejects malformed Q5 answers before scoreQuiz runs. Logged anyway
    // as a defensive signal in case that validation ever has a gap.
    // No PII (name/email/phone) included, per logging policy.
    console.warn("[quiz/submit] Unexpected unknown lead temperature", {
      route: "/api/quiz/submit",
      sessionId: data.sessionId || null,
      invalidQ5Answer: data.answers["q5"] ?? null,
      reason: "leadTemp resolved to 'unknown' after Q5 validation passed — check validateQuizQ5Answer / classifyQuizLeadTemperature for a gap.",
    });
  }

  // Determine lead source
  const leadSource = data.utmSource || (data.refCode ? "ambassador" : "direct");

  let leadId: string | null = null;

  // Save to Supabase
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      // Resolve ambassador if ref code provided
      let ambassadorId: string | null = null;
      if (data.refCode) {
        const { data: amb } = await supabase
          .from("ambassadors")
          .select("id, reward_per_lead")
          .eq("ref_code", data.refCode.toUpperCase())
          .eq("active", true)
          .single();

        if (amb) {
          ambassadorId = amb.id;
        }
      }

      const { data: lead, error } = await supabase
        .from("leads")
        .insert({
          first_name: data.firstName,
          email: data.email,
          phone: data.phone || null,
          zip: data.zip || null,
          dollhouse_result: scoring.result.key,
          service_interest: scoring.result.serviceMatch,
          lead_temp: leadTemp,
          lead_source: leadSource,
          utm_source: data.utmSource || null,
          utm_medium: data.utmMedium || null,
          utm_campaign: data.utmCampaign || null,
          utm_content: data.utmContent || null,
          ref_code: data.refCode || null,
          ambassador_id: ambassadorId,
          quiz_answers: { ...data.answers, _write_ins: data.writeIns },
          marketing_consent: data.marketingConsent,
          status: "new",
        })
        .select("id")
        .single();

      if (error) {
        console.error("[quiz/submit] Supabase insert error:", error);
      } else if (lead) {
        leadId = lead.id;

        // Create ambassador reward if applicable
        if (ambassadorId) {
          const { data: amb } = await supabase
            .from("ambassadors")
            .select("reward_per_lead")
            .eq("id", ambassadorId)
            .single();

          if (amb) {
            await supabase.from("ambassador_rewards").insert({
              ambassador_id: ambassadorId,
              lead_id: leadId,
              reward_type: "lead",
              amount: amb.reward_per_lead,
              paid: false,
            });
          }
        }

        // Log the result event
        await supabase.from("quiz_events").insert({
          event: "lead_submitted",
          session_id: data.sessionId || null,
          lead_id: leadId,
          payload: {
            result: scoring.result.key,
            service: scoring.result.serviceMatch,
            lead_temp: leadTemp,
          },
          utm_source: data.utmSource || null,
          utm_medium: data.utmMedium || null,
          utm_campaign: data.utmCampaign || null,
          ref_code: data.refCode || null,
        });
      }
    } catch (err) {
      console.error("[quiz/submit] Supabase error:", err);
    }
  } else {
    console.warn("[quiz/submit] Supabase not configured — lead not persisted to database");
  }

  // Google Sheets fallback (existing integration)
  try {
    await sendLeadToGoogleSheets({
      firstName: data.firstName,
      email: data.email,
      phone: data.phone ?? "",
      dollhouseResult: scoring.result.dollName,
      serviceMatch: scoring.result.serviceMatch,
      leadTemp,
      source: leadSource,
      utmCampaign: data.utmCampaign ?? "",
      utmSource: data.utmSource ?? "",
      utmMedium: data.utmMedium ?? "",
      utmContent: data.utmContent ?? "",
      refCode: data.refCode ?? "",
      submittedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[quiz/submit] Google Sheets error:", err);
  }

  // Send emails (non-blocking)
  if (data.marketingConsent) {
    sendQuizResultEmail({
      firstName: data.firstName,
      email: data.email,
      result: scoring.result,
      leadTemp: scoring.leadTemp,
    }).catch((e) => console.error("[email]", e));
  }

  sendTeamNotification({
    firstName: data.firstName,
    email: data.email,
    phone: data.phone,
    result: scoring.result,
    leadTemp: scoring.leadTemp,
    refCode: data.refCode,
  }).catch((e) => console.error("[email]", e));

  // GoHighLevel webhook
  if (process.env.GHL_WEBHOOK_URL) {
    const ghlPayload = buildQuizGhlPayload({
      firstName: data.firstName,
      email: data.email,
      phone: data.phone,
      quizResultDollName: scoring.result.dollName,
      quizResultKey: scoring.result.key,
      serviceInterest: scoring.result.serviceMatch,
      leadTemp,
      source: leadSource,
      utmSource: data.utmSource || "",
      utmMedium: data.utmMedium || "",
      utmCampaign: data.utmCampaign || "",
      refCode: data.refCode || "",
    });
    fetch(process.env.GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ghlPayload),
    }).catch((e) => console.error("[ghl] Quiz webhook error:", e));
  }

  console.log("[quiz/submit] New quiz lead:", {
    name: data.firstName,
    email: data.email,
    result: scoring.result.key,
    leadTemp,
    leadId,
  });

  return NextResponse.json({
    ok: true,
    leadId,
    result: {
      key: scoring.result.key,
      dollName: scoring.result.dollName,
      serviceMatch: scoring.result.serviceMatch,
      emoji: scoring.result.emoji,
      tagline: scoring.result.tagline,
      description: scoring.result.description,
      benefits: scoring.result.benefits,
      whyYouMatched: scoring.result.whyYouMatched,
      nextStep: scoring.result.nextStep,
    },
    leadTemp,
    matchedAnswers: scoring.matchedAnswers,
  });
}
