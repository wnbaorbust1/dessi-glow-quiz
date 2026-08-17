import { describe, it, expect } from "vitest";
import {
  classifyQuizLeadTemperature,
  classifyTimeframeLeadTemperature,
  validateQuizQ5Answer,
  leadTempLabel,
  leadTempBadge,
  LEAD_TEMPERATURES,
} from "../lead-temperature";
import { buildQuizGhlPayload, buildConsultationGhlPayload } from "../ghl-webhook";

// ── Quiz path (Q5) ───────────────────────────────────────────────────────

describe("classifyQuizLeadTemperature", () => {
  it("maps q5_a to hot", () => {
    expect(classifyQuizLeadTemperature(["q5_a"])).toBe("hot");
  });

  it("maps q5_b to warm", () => {
    expect(classifyQuizLeadTemperature(["q5_b"])).toBe("warm");
  });

  it("maps q5_c to nurture", () => {
    expect(classifyQuizLeadTemperature(["q5_c"])).toBe("nurture");
  });

  it("maps q5_d to education", () => {
    expect(classifyQuizLeadTemperature(["q5_d"])).toBe("education");
  });

  it("returns unknown for undefined (missing question)", () => {
    expect(classifyQuizLeadTemperature(undefined)).toBe("unknown");
  });

  it("returns unknown for an empty array", () => {
    expect(classifyQuizLeadTemperature([])).toBe("unknown");
  });

  it("returns unknown for an unrecognized option id", () => {
    expect(classifyQuizLeadTemperature(["q5_z"])).toBe("unknown");
  });

  it("returns unknown for more than one answer", () => {
    expect(classifyQuizLeadTemperature(["q5_a", "q5_b"])).toBe("unknown");
  });

  it("never returns education/nurture as a silent default for bad input", () => {
    const badInputs: (string[] | undefined)[] = [undefined, [], ["nope"], ["q5_a", "q5_c"]];
    for (const input of badInputs) {
      const result = classifyQuizLeadTemperature(input);
      expect(result).toBe("unknown");
      expect(result).not.toBe("education");
      expect(result).not.toBe("nurture");
    }
  });
});

describe("validateQuizQ5Answer", () => {
  it("returns null for each valid single answer", () => {
    for (const id of ["q5_a", "q5_b", "q5_c", "q5_d"]) {
      expect(validateQuizQ5Answer([id])).toBeNull();
    }
  });

  it("returns a reason string when missing", () => {
    expect(validateQuizQ5Answer(undefined)).toMatch(/missing/i);
  });

  it("returns a reason string when empty", () => {
    expect(validateQuizQ5Answer([])).toMatch(/missing/i);
  });

  it("returns a reason string when there are multiple answers", () => {
    expect(validateQuizQ5Answer(["q5_a", "q5_b"])).toMatch(/exactly one/i);
  });

  it("returns a reason string for an unrecognized id", () => {
    expect(validateQuizQ5Answer(["q5_z"])).toMatch(/not a recognized option/i);
  });
});

// ── Consultation-form path (timeframe) ──────────────────────────────────

describe("classifyTimeframeLeadTemperature", () => {
  it("maps 'As soon as possible' to hot", () => {
    expect(classifyTimeframeLeadTemperature("As soon as possible")).toBe("hot");
  });

  it("maps 'Within 2 weeks' to warm", () => {
    expect(classifyTimeframeLeadTemperature("Within 2 weeks")).toBe("warm");
  });

  it("maps 'Within 30 days' to warm", () => {
    expect(classifyTimeframeLeadTemperature("Within 30 days")).toBe("warm");
  });

  it("maps 'In the next 1–3 months' to nurture", () => {
    expect(classifyTimeframeLeadTemperature("In the next 1–3 months")).toBe("nurture");
  });

  it("maps '1–3 months' to nurture", () => {
    expect(classifyTimeframeLeadTemperature("1–3 months")).toBe("nurture");
  });

  it("maps 'Just researching' to education", () => {
    expect(classifyTimeframeLeadTemperature("Just researching")).toBe("education");
  });

  it("maps 'Just researching for now' to education", () => {
    expect(classifyTimeframeLeadTemperature("Just researching for now")).toBe("education");
  });

  it("returns unknown for a missing value", () => {
    expect(classifyTimeframeLeadTemperature(undefined)).toBe("unknown");
    expect(classifyTimeframeLeadTemperature(null)).toBe("unknown");
    expect(classifyTimeframeLeadTemperature("")).toBe("unknown");
  });

  it("returns unknown for an unrecognized value — never a silent 'nurture' fallback", () => {
    const result = classifyTimeframeLeadTemperature("sometime next year maybe");
    expect(result).toBe("unknown");
    expect(result).not.toBe("nurture");
  });
});

// ── Display helpers ──────────────────────────────────────────────────────

describe("leadTempLabel / leadTempBadge", () => {
  it("has a label and badge for every canonical value, including unknown", () => {
    for (const temp of LEAD_TEMPERATURES) {
      expect(leadTempLabel(temp)).toBeTruthy();
      expect(leadTempBadge(temp)).toBeTruthy();
    }
  });
});

// ── GHL webhook payloads ─────────────────────────────────────────────────

describe("buildQuizGhlPayload", () => {
  it("includes lead_temp", () => {
    const payload = buildQuizGhlPayload({
      firstName: "Jane",
      email: "jane@example.com",
      phone: "5125550100",
      quizResultDollName: "The Curves Doll",
      quizResultKey: "curves",
      serviceInterest: "Liquid BBL Consultation",
      leadTemp: "hot",
      source: "direct",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      refCode: "",
    });
    expect(payload.lead_temp).toBe("hot");
    expect(payload.source_type).toBe("quiz");
  });
});

describe("buildConsultationGhlPayload", () => {
  it("includes lead_temp", () => {
    const payload = buildConsultationGhlPayload({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "5125550100",
      serviceInterest: "Liquid BBL",
      timeframe: "As soon as possible",
      mainGoal: "",
      source: "website",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      leadTemp: "hot",
    });
    expect(payload.lead_temp).toBe("hot");
    expect(payload.source_type).toBe("consultation");
  });
});

describe("webhook / Supabase value consistency", () => {
  it("quiz: the same computed leadTemp flows into the GHL payload unchanged", () => {
    for (const temp of ["hot", "warm", "nurture", "education", "unknown"] as const) {
      const supabaseValue = temp; // what would be written to leads.lead_temp
      const payload = buildQuizGhlPayload({
        firstName: "Jane",
        email: "jane@example.com",
        phone: "",
        quizResultDollName: "The Custom Doll",
        quizResultKey: "custom",
        serviceInterest: "Personal Consultation",
        leadTemp: temp,
        source: "direct",
        utmSource: "",
        utmMedium: "",
        utmCampaign: "",
        refCode: "",
      });
      expect(payload.lead_temp).toBe(supabaseValue);
    }
  });

  it("consultation form: the same computed leadTemp flows into the GHL payload unchanged", () => {
    for (const temp of ["hot", "warm", "nurture", "education", "unknown"] as const) {
      const supabaseValue = temp;
      const payload = buildConsultationGhlPayload({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        phone: "",
        serviceInterest: "Botox",
        timeframe: "Within 2 weeks",
        mainGoal: "",
        source: "website",
        utmSource: "",
        utmMedium: "",
        utmCampaign: "",
        leadTemp: temp,
      });
      expect(payload.lead_temp).toBe(supabaseValue);
    }
  });
});
