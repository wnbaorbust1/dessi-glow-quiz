/**
 * POST /api/quiz/event
 *
 * Lightweight funnel analytics endpoint.
 * Records quiz events to Supabase quiz_events table.
 * No-ops gracefully if Supabase is not configured.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";

const VALID_EVENTS = [
  "landing_view",
  "quiz_start",
  "question_answered",
  "lead_capture_view",
  "lead_submitted",
  "result_viewed",
  "booking_clicked",
  "share_clicked",
  "quiz_abandoned",
] as const;

const eventSchema = z.object({
  event: z.string().refine((v): v is typeof VALID_EVENTS[number] => (VALID_EVENTS as readonly string[]).includes(v), {
    message: "Invalid event.",
  }),
  sessionId: z.string().max(100).optional(),
  leadId: z.string().max(36).optional(),
  payload: z.record(z.string(), z.unknown()).optional().default({}),
  utmSource: z.string().max(200).optional(),
  utmMedium: z.string().max(200).optional(),
  utmCampaign: z.string().max(200).optional(),
  refCode: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const d = parsed.data;

  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase.from("quiz_events").insert({
        event: d.event,
        session_id: d.sessionId ?? null,
        lead_id: d.leadId ?? null,
        payload: d.payload as Record<string, unknown>,
        utm_source: d.utmSource ?? null,
        utm_medium: d.utmMedium ?? null,
        utm_campaign: d.utmCampaign ?? null,
        ref_code: d.refCode ?? null,
      });
    } catch (err) {
      console.error("[quiz/event] Supabase error:", err);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(`[quiz/event] ${d.event}`, d.payload);
  }

  return NextResponse.json({ ok: true });
}

/** PATCH /api/quiz/event — mark booking clicked for a lead */
export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = z.object({ leadId: z.string().min(1).max(36) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      await supabase
        .from("leads")
        .update({ booking_clicked: true, booking_clicked_at: new Date().toISOString() })
        .eq("id", parsed.data.leadId);
    } catch (err) {
      console.error("[quiz/event] booking_clicked update error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
