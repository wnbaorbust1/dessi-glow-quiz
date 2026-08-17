/**
 * Canonical lead-temperature classification — the single source of truth
 * used by BOTH submission paths (quiz and plain consultation form) so the
 * "Dessi Lead Temperature" field means the same thing regardless of entry
 * point.
 *
 * Compute a LeadTemperature ONCE per submission (via one of the classify*
 * functions below) and reuse that same value everywhere it's needed
 * (Supabase insert, GHL webhook, logs). Do not recompute it independently
 * in more than one place.
 */

export type LeadTemperature = "hot" | "warm" | "nurture" | "education" | "unknown";

export const LEAD_TEMPERATURES: readonly LeadTemperature[] = [
  "hot",
  "warm",
  "nurture",
  "education",
  "unknown",
] as const;

// ---------------------------------------------------------------------------
// Quiz path (Q5 — "When are you hoping to book your next beauty appointment?")
// ---------------------------------------------------------------------------

/**
 * Quiz Q5 option id -> canonical lead temperature. This is the one place
 * that mapping is defined. Keep in sync with the "q5" question's option ids
 * in lib/quiz-data.ts if that question is ever edited.
 */
export const QUIZ_Q5_LEAD_TEMP_MAP: Record<string, LeadTemperature> = {
  q5_a: "hot", // "As soon as possible — I'm ready now"
  q5_b: "warm", // "Within the next 30 days"
  q5_c: "nurture", // "In the next 1–3 months"
  q5_d: "education", // "Just researching for now"
};

/**
 * Validate a quiz's raw Q5 answer array. Returns a human-readable reason
 * string if invalid, or null if valid. Used by app/api/quiz/submit/route.ts
 * to reject malformed submissions before scoring/persisting anything.
 */
export function validateQuizQ5Answer(q5Answers: string[] | undefined): string | null {
  if (!q5Answers || q5Answers.length === 0) {
    return "Q5 (booking timing) answer is missing.";
  }
  if (q5Answers.length > 1) {
    return "Q5 (booking timing) must have exactly one answer, received multiple.";
  }
  if (!(q5Answers[0] in QUIZ_Q5_LEAD_TEMP_MAP)) {
    return `Q5 (booking timing) answer id "${q5Answers[0]}" is not a recognized option.`;
  }
  return null;
}

/**
 * Classify a quiz's Q5 answer array into a canonical LeadTemperature.
 * Returns "unknown" — NEVER a silent default to "education" or "nurture"
 * — when the answer is missing, empty, contains more than one id, or the
 * id doesn't match a known Q5 option.
 *
 * In normal use this should never actually return "unknown", because
 * app/api/quiz/submit/route.ts rejects malformed Q5 answers via
 * validateQuizQ5Answer() before scoring runs. This function stays
 * defensive anyway, so it never guesses if it's ever called from
 * somewhere that skipped that validation.
 */
export function classifyQuizLeadTemperature(q5Answers: string[] | undefined): LeadTemperature {
  if (validateQuizQ5Answer(q5Answers) !== null) return "unknown";
  return QUIZ_Q5_LEAD_TEMP_MAP[(q5Answers as string[])[0]] ?? "unknown";
}

// ---------------------------------------------------------------------------
// Consultation-form path ("Preferred appointment timeframe")
// ---------------------------------------------------------------------------

/**
 * Consultation-form "timeframe" value -> canonical lead temperature.
 * Includes a couple of synonym strings so this stays correct even if
 * question wording drifts slightly from the dropdown's exact options.
 */
const TIMEFRAME_LEAD_TEMP_MAP: Record<string, LeadTemperature> = {
  "As soon as possible": "hot",
  "Within 2 weeks": "warm",
  "Within 30 days": "warm",
  "In the next 1–3 months": "nurture",
  "1–3 months": "nurture",
  "Just researching": "education",
  "Just researching for now": "education",
};

/**
 * Classify a consultation-form "timeframe" value into a canonical
 * LeadTemperature. Returns "unknown" for missing/unrecognized values —
 * NEVER a silent fallback to "nurture" or any other bucket.
 */
export function classifyTimeframeLeadTemperature(
  timeframe: string | null | undefined
): LeadTemperature {
  if (!timeframe) return "unknown";
  return TIMEFRAME_LEAD_TEMP_MAP[timeframe] ?? "unknown";
}

// ---------------------------------------------------------------------------
// Display helpers (admin UI, emails)
// ---------------------------------------------------------------------------

/** Human-readable label, e.g. for admin UI / email subject lines. */
export function leadTempLabel(temp: LeadTemperature): string {
  const labels: Record<LeadTemperature, string> = {
    hot: "Hot — Ready Now",
    warm: "Warm — Within 30 Days",
    nurture: "Nurture — 1–3 Months",
    education: "Education — Just Researching",
    unknown: "Unknown — Needs Review",
  };
  return labels[temp];
}

/** Short badge label, e.g. for admin table chips. */
export function leadTempBadge(temp: LeadTemperature): string {
  const badges: Record<LeadTemperature, string> = {
    hot: "Hot",
    warm: "Warm",
    nurture: "Nurture",
    education: "Education",
    unknown: "Unknown",
  };
  return badges[temp];
}
