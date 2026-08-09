/**
 * Quiz scoring engine — pure functions, no UI dependencies.
 * Import this file in tests and in the quiz UI component.
 *
 * IMPORTANT: Quiz results describe potential service matches for
 * educational/promotional purposes only. They do not constitute medical
 * advice and do not determine treatment eligibility.
 */

import { QUIZ_QUESTIONS, QUIZ_RESULTS } from "./quiz-data";
import type {
  QuizAnswers,
  ResultKey,
  LeadTemperature,
  ScoringOutput,
} from "./quiz-types";

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

  let leadTemp: LeadTemperature = "education";
  const matchedAnswers: string[] = [];

  for (const question of QUIZ_QUESTIONS) {
    const chosenIds = answers[question.id];
    if (!chosenIds || chosenIds.length === 0) continue;

    for (const chosenId of chosenIds) {
      const option = question.options.find((o) => o.id === chosenId);
      if (!option) continue;

      // Capture lead temperature from Q5
      if (option.leadTemp) {
        leadTemp = option.leadTemp;
        continue; // don't add weights for this question
      }

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
 */
export function leadTempLabel(temp: LeadTemperature): string {
  const labels: Record<LeadTemperature, string> = {
    hot: "Hot — Ready Now",
    warm: "Warm — Within 30 Days",
    nurture: "Nurture — 1–3 Months",
    education: "Education — Just Researching",
  };
  return labels[temp];
}

/**
 * Map a lead temperature to a short badge label (for admin UI).
 */
export function leadTempBadge(temp: LeadTemperature): string {
  const badges: Record<LeadTemperature, string> = {
    hot: "Hot",
    warm: "Warm",
    nurture: "Nurture",
    education: "Education",
  };
  return badges[temp];
}
