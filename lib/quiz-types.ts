/** All possible quiz result keys */
export type ResultKey =
  | "subtle_lip"
  | "pout"
  | "refresh"
  | "smooth"
  | "reset"
  | "sculpt"
  | "curves"
  | "sparkle"
  | "custom";

/** Lead temperature derived from Q5 */
export type LeadTemperature = "hot" | "warm" | "nurture" | "education";

/** A single answer option within a question */
export interface AnswerOption {
  id: string;
  text: string;
  /** Weights added to result keys when this answer is chosen */
  weights: Partial<Record<ResultKey, number>>;
  /** If set, this answer drives lead temperature rather than result scoring */
  leadTemp?: LeadTemperature;
}

/** A single quiz question */
export interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: AnswerOption[];
  /** If true, render checkboxes + Next button (multiple selections allowed) */
  allowMultiple?: boolean;
  /** If true, show a free-text "Other" write-in field below the options */
  allowWriteIn?: boolean;
  /** If true, this question only captures lead temperature — no result scoring */
  isLeadTempQuestion?: boolean;
}

/** The computed quiz result */
export interface QuizResult {
  key: ResultKey;
  dollName: string;
  serviceMatch: string;
  emoji: string;
  tagline: string;
  description: string;
  /** 3–4 bullet points about what the service involves / what to expect */
  benefits: string[];
  whyYouMatched: string;
  nextStep: string;
}

/** Quiz answers: questionId → array of selected answer IDs */
export type QuizAnswers = Record<string, string[]>;

/** Free-text write-in answers: questionId → custom text (not scored) */
export type WriteInAnswers = Record<string, string>;

/** Full computed output from the scoring engine */
export interface ScoringOutput {
  result: QuizResult;
  scores: Record<ResultKey, number>;
  leadTemp: LeadTemperature;
  matchedAnswers: string[]; // human-readable answer texts for "why you matched" section
}
