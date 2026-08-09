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
import { getSupabaseServer } from "@/lib/supabase/server";
import { sendQuizResultEmail, sendTeamNotification } from "@/lib/email";
import { sendLeadToGoogleSheets } from "@/lib/google-sheets-quiz";

const submitSchema = z.object({
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

  // Map lead temp
  const leadTempMap: Record<string, string> = {
    hot: "hot", warm: "warm", nurture: "nurture", education: "education",
  };
  const leadTemp = leadTempMap[scoring.leadTemp] ?? "education";

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
    fetch(process.env.GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: data.firstName,
        email: data.email,
        phone: data.phone,
        quiz_result: scoring.result.dollName,
        service_interest: scoring.result.serviceMatch,
        lead_temp: leadTemp,
        utm_source: data.utmSource,
        utm_medium: data.utmMedium,
        utm_campaign: data.utmCampaign,
        ref_code: data.refCode,
        source: leadSource,
        tags: ["glow-quiz", "dessi-dollhouse", scoring.result.key],
      }),
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
