/**
 * Quiz scoring engine — pure functions, no UI dependencies.
 * Import this file in tests and in the quiz UI component.
 *
 * IMPORTANT: Quiz results describe potential service matches for
 * educational/promotional purposes only. They do not constitute medical
 * advice and do not determine treatment eligibility.
 */

import { QUIZ_QUESTIONS, QUIZ_RESULTS } from "./quiz-data";
import type { QuizAnswers, ResultKey, ScoringOutput } from "./quiz-types";
import {
  classifyQuizLeadTemperature,
  leadTempBadge as leadTempBadgeCanonical,
  leadTempLabel as leadTempLabelCanonical,
  type LeadTemperature,
} from "./lead-temperature";

/** id of the question flagged as the lead-temperature question (Q5) */
const LEAD_TEMP_QUESTION_ID = QUIZ_QUESTIONS.find((q) => q.isLeadTempQuestion)?.id;

const ALL_RESULT_KEYS: ResultKey[] = [
  "subtle_lip",
  "pout",
  "refresh",
  "smooth",
  "reset",
  "sculpt",
  "curves",
  "sparkle",
  "custom",
];

/**
 * Compute scores for all 9 result types given a set of quiz answers.
 * Returns the winning result, all scores, detected lead temp, and matched
 * answer texts for the "Why You Matched" section.
 */
export function scoreQuiz(answers: QuizAnswers): ScoringOutput {
  // Initialize scores
  const scores: Record<ResultKey, number> = Object.fromEntries(
    ALL_RESULT_KEYS.map((k) => [k, 0])
  ) as Record<ResultKey, number>;

  const matchedAnswers: string[] = [];

  for (const question of QUIZ_QUESTIONS) {
    const chosenIds = answers[question.id];
    if (!chosenIds || chosenIds.length === 0) continue;

    for (const chosenId of chosenIds) {
      const option = question.options.find((o) => o.id === chosenId);
      if (!option) continue;

      // Q5 (the lead-temperature question) drives lead temperature, not
      // result scoring — skip it here. Lead temperature is computed
      // separately below via classifyQuizLeadTemperature(), independently
      // of the Dollhouse result / service match / scores, so nothing in
      // this scoring loop can influence it.
      if (option.leadTemp) continue;

      // Add weights to scores
      for (const [key, weight] of Object.entries(option.weights) as [ResultKey, number][]) {
        scores[key] = (scores[key] ?? 0) + weight;
      }

      // Collect non-temp answers for the "why you matched" section
      matchedAnswers.push(option.text);
    }
  }

  // If the user selected many answers across many different result categories,
  // they have broad/unclear goals — boost "custom" so it wins.
  const totalAnswersSelected = Object.values(answers)
    .flat()
    .filter((id) => !id.startsWith("q5_")) // exclude lead temp question
    .length;
  const resultKeysScored = ALL_RESULT_KEYS.filter((k) => scores[k] > 0).length;
  if (totalAnswersSelected >= 8 || resultKeysScored >= 7) {
    scores["custom"] = Math.max(...Object.values(scores)) + 2;
  }

  const winningKey = selectWinner(scores, answers);

  // Lead temperature: derived ONLY from the Q5 answer, via the canonical
  // classifier in lib/lead-temperature.ts. No default/fallback here — if
  // Q5 is missing, empty, or invalid, this returns "unknown" rather than
  // silently becoming "education". (In practice this route's caller,
  // app/api/quiz/submit/route.ts, rejects malformed Q5 answers before
  // calling scoreQuiz at all — see validateQuizQ5Answer.)
  const leadTemp: LeadTemperature = classifyQuizLeadTemperature(
    LEAD_TEMP_QUESTION_ID ? answers[LEAD_TEMP_QUESTION_ID] : undefined
  );

  return {
    result: QUIZ_RESULTS[winningKey],
    scores,
    leadTemp,
    matchedAnswers,
  };
}

/**
 * Select the winning result key from the scores map.
 *
 * Tie-breaking order:
 * 1. Highest total score wins.
 * 2. If tied, prefer the result selected in Q1 (user's primary goal).
 * 3. If still tied, prefer the result selected in Q2 (area focus).
 * 4. If still tied, fall back to "custom".
 */
function selectWinner(
  scores: Record<ResultKey, number>,
  answers: QuizAnswers
): ResultKey {
  const maxScore = Math.max(...Object.values(scores));

  if (maxScore === 0) return "custom";

  const tied = (Object.entries(scores) as [ResultKey, number][])
    .filter(([, score]) => score === maxScore)
    .map(([key]) => key);

  if (tied.length === 1) return tied[0];

  // Tiebreaker 1: first Q1 answer (primary goal)
  const q1Answers = answers["q1"];
  const q1Answer = q1Answers?.[0];
  if (q1Answer) {
    const q1 = QUIZ_QUESTIONS.find((q) => q.id === "q1");
    const q1Option = q1?.options.find((o) => o.id === q1Answer);
    if (q1Option) {
      const q1Candidates = (Object.entries(q1Option.weights) as [ResultKey, number][])
        .sort(([, a], [, b]) => b - a)
        .map(([key]) => key);
      for (const candidate of q1Candidates) {
        if (tied.includes(candidate)) return candidate;
      }
    }
  }

  // Tiebreaker 2: first Q2 answer (area focus)
  const q2Answers = answers["q2"];
  const q2Answer = q2Answers?.[0];
  if (q2Answer) {
    const q2 = QUIZ_QUESTIONS.find((q) => q.id === "q2");
    const q2Option = q2?.options.find((o) => o.id === q2Answer);
    if (q2Option) {
      const q2Candidates = (Object.entries(q2Option.weights) as [ResultKey, number][])
        .sort(([, a], [, b]) => b - a)
        .map(([key]) => key);
      for (const candidate of q2Candidates) {
        if (tied.includes(candidate)) return candidate;
      }
    }
  }

  return "custom";
}

/**
 * Map a lead temperature to a human-readable label.
 * Re-exported from lib/lead-temperature.ts (the canonical source) so
 * existing `import { leadTempLabel } from "./quiz-scoring"` call sites
 * keep working unchanged.
 */
export function leadTempLabel(temp: LeadTemperature): string {
  return leadTempLabelCanonical(temp);
}

/**
 * Map a lead temperature to a short badge label (for admin UI).
 * Re-exported from lib/lead-temperature.ts — see leadTempLabel above.
 */
export function leadTempBadge(temp: LeadTemperature): string {
  return leadTempBadgeCanonical(temp);
}
