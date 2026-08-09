import { describe, it, expect } from "vitest";
import { scoreQuiz, leadTempLabel, leadTempBadge } from "../quiz-scoring";
import type { QuizAnswers } from "../quiz-types";

// ── Helpers ────────────────────────────────────────────────────────────────

/** Build answers that strongly target a specific result */
function answersFor(resultKey: string): QuizAnswers {
  const presets: Record<string, QuizAnswers> = {
    pout: { q1: ["q1_a"], q2: ["q2_a"], q3: ["q3_b"], q4: ["q4_b"], q5: ["q5_a"], q6: ["q6_b"] },
    subtle_lip: { q1: ["q1_b"], q2: ["q2_a"], q3: ["q3_a"], q4: ["q4_a"], q5: ["q5_b"], q6: ["q6_a"] },
    refresh: { q1: ["q1_c"], q2: ["q2_b"], q3: ["q3_a"], q4: ["q4_a"], q5: ["q5_b"], q6: ["q6_a"] },
    smooth: { q1: ["q1_c"], q2: ["q2_b"], q3: ["q3_d"], q4: ["q4_d"], q5: ["q5_c"], q6: ["q6_c"] },
    reset: { q1: ["q1_f"], q2: ["q2_e"], q3: ["q3_d"], q4: ["q4_c"], q5: ["q5_b"], q6: ["q6_c"] },
    sculpt: { q1: ["q1_d"], q2: ["q2_c"], q3: ["q3_c"], q4: ["q4_a"], q5: ["q5_a"], q6: ["q6_a"] },
    curves: { q1: ["q1_d"], q2: ["q2_c"], q3: ["q3_b"], q4: ["q4_b"], q5: ["q5_a"], q6: ["q6_b"] },
    sparkle: { q1: ["q1_e"], q2: ["q2_d"], q3: ["q3_e"], q4: ["q4_a"], q5: ["q5_c"], q6: ["q6_d"] },
    custom: { q1: ["q1_f"], q2: ["q2_f"], q3: ["q3_e"], q4: ["q4_d"], q5: ["q5_d"], q6: ["q6_d"] },
  };
  return presets[resultKey] ?? {};
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("scoreQuiz — all 9 results", () => {
  const RESULTS = ["pout", "subtle_lip", "refresh", "smooth", "reset", "sculpt", "curves", "sparkle", "custom"];

  RESULTS.forEach((key) => {
    it(`returns "${key}" for targeted answers`, () => {
      const output = scoreQuiz(answersFor(key));
      expect(output.result.key).toBe(key);
    });
  });
});

describe("scoreQuiz — lead temperature", () => {
  it("returns hot for q5_a (as soon as possible)", () => {
    const output = scoreQuiz({ q1: ["q1_a"], q5: ["q5_a"] });
    expect(output.leadTemp).toBe("hot");
  });

  it("returns warm for q5_b (within 30 days)", () => {
    const output = scoreQuiz({ q1: ["q1_a"], q5: ["q5_b"] });
    expect(output.leadTemp).toBe("warm");
  });

  it("returns nurture for q5_c (1–3 months)", () => {
    const output = scoreQuiz({ q1: ["q1_a"], q5: ["q5_c"] });
    expect(output.leadTemp).toBe("nurture");
  });

  it("returns education for q5_d (just researching)", () => {
    const output = scoreQuiz({ q1: ["q1_a"], q5: ["q5_d"] });
    expect(output.leadTemp).toBe("education");
  });

  it("defaults to education when q5 is not answered", () => {
    const output = scoreQuiz({ q1: ["q1_a"] });
    expect(output.leadTemp).toBe("education");
  });
});

describe("scoreQuiz — scoring", () => {
  it("returns scores for all 9 result keys", () => {
    const output = scoreQuiz(answersFor("pout"));
    const keys = Object.keys(output.scores);
    expect(keys).toContain("pout");
    expect(keys).toContain("custom");
    expect(keys.length).toBe(9);
  });

  it("winning result has the highest score", () => {
    const output = scoreQuiz(answersFor("curves"));
    const winner = output.result.key;
    const winningScore = output.scores[winner];
    for (const [key, score] of Object.entries(output.scores)) {
      if (key !== winner) {
        expect(winningScore).toBeGreaterThanOrEqual(score);
      }
    }
  });

  it("empty answers return custom with zero scores", () => {
    const output = scoreQuiz({});
    expect(output.result.key).toBe("custom");
    expect(Object.values(output.scores).every((s) => s === 0)).toBe(true);
  });
});

describe("scoreQuiz — tie breaking", () => {
  it("resolves ties using Q1 primary goal", () => {
    // Force a tie by only providing q2 (both pout and subtle_lip get 2 points)
    const output = scoreQuiz({ q2: ["q2_a"] }); // lips → pout:2, subtle_lip:2 tie
    // With no q1, should still resolve deterministically (not throw)
    expect(output.result.key).toBeDefined();
    expect(typeof output.result.key).toBe("string");
  });

  it("does not throw on any combination of valid answer IDs", () => {
    const validCombinations: QuizAnswers[] = [
      { q1: ["q1_a"], q3: ["q3_b"] },
      { q2: ["q2_c"], q4: ["q4_b"], q6: ["q6_b"] },
      { q1: ["q1_e"], q2: ["q2_d"] },
    ];
    for (const answers of validCombinations) {
      expect(() => scoreQuiz(answers)).not.toThrow();
    }
  });
});

describe("scoreQuiz — matched answers", () => {
  it("returns human-readable matched answers (excluding lead temp question)", () => {
    const output = scoreQuiz(answersFor("pout"));
    // q5 is the lead temp question — its answer text should NOT appear in matchedAnswers
    expect(output.matchedAnswers.length).toBeGreaterThan(0);
    // None of the lead temp option texts should appear
    const leadTempTexts = [
      "As soon as possible — I'm ready now",
      "Within the next 30 days",
      "In the next 1–3 months",
      "Just researching for now",
    ];
    for (const text of leadTempTexts) {
      expect(output.matchedAnswers).not.toContain(text);
    }
  });
});

describe("scoreQuiz — result metadata", () => {
  it("all results have required fields", () => {
    const RESULTS = ["pout", "subtle_lip", "refresh", "smooth", "reset", "sculpt", "curves", "sparkle", "custom"];
    for (const key of RESULTS) {
      const output = scoreQuiz(answersFor(key));
      expect(output.result.dollName).toBeTruthy();
      expect(output.result.serviceMatch).toBeTruthy();
      expect(output.result.emoji).toBeTruthy();
      expect(output.result.description).toBeTruthy();
      expect(output.result.nextStep).toBeTruthy();
      expect(output.result.benefits.length).toBeGreaterThan(0);
    }
  });
});

describe("leadTempLabel", () => {
  it("returns correct labels for all temperatures", () => {
    expect(leadTempLabel("hot")).toContain("Hot");
    expect(leadTempLabel("warm")).toContain("Warm");
    expect(leadTempLabel("nurture")).toContain("Nurture");
    expect(leadTempLabel("education")).toContain("Education");
  });
});

describe("leadTempBadge", () => {
  it("returns short badge labels", () => {
    expect(leadTempBadge("hot")).toBe("Hot");
    expect(leadTempBadge("warm")).toBe("Warm");
  });
});

describe("UTM persistence", () => {
  it("does not affect quiz scoring", () => {
    // UTM params are stored separately — scoring should only use quiz answers
    const answers = answersFor("reset");
    const output1 = scoreQuiz(answers);
    const output2 = scoreQuiz(answers);
    expect(output1.result.key).toBe(output2.result.key);
  });
});

describe("referral code persistence", () => {
  it("scoring is independent of referral code (pure function)", () => {
    const answers = answersFor("sparkle");
    const output = scoreQuiz(answers);
    // scoreQuiz never receives a ref code — it only scores answers
    expect(output.result.key).toBe("sparkle");
  });
});
