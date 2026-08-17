/**
 * Shared GoHighLevel webhook payload builders — pure functions, no network
 * calls, so both submission routes build the "lead_temp" field the same
 * way and it's cheap to unit test (see lib/__tests__/lead-temperature.test.ts).
 *
 * Both routes pass in a `leadTemp` computed ONCE (see lib/lead-temperature.ts)
 * and reused for Supabase, this payload, and any logging — never
 * recomputed independently per destination.
 */
import type { LeadTemperature } from "./lead-temperature";

export interface QuizGhlPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  source_type: "quiz";
  quiz_result: string;
  quiz_result_key: string;
  service_interest: string;
  lead_temp: LeadTemperature;
  source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  ref_code: string;
  tags: string[];
}

export function buildQuizGhlPayload(input: {
  firstName: string;
  email: string;
  phone: string;
  quizResultDollName: string;
  quizResultKey: string;
  serviceInterest: string;
  leadTemp: LeadTemperature;
  source: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  refCode: string;
}): QuizGhlPayload {
  return {
    first_name: input.firstName,
    last_name: "",
    email: input.email,
    phone: input.phone,
    source_type: "quiz",
    quiz_result: input.quizResultDollName,
    quiz_result_key: input.quizResultKey,
    service_interest: input.serviceInterest,
    lead_temp: input.leadTemp,
    source: input.source,
    utm_source: input.utmSource,
    utm_medium: input.utmMedium,
    utm_campaign: input.utmCampaign,
    ref_code: input.refCode,
    tags: ["glow-quiz", "dessi-dollhouse", input.quizResultKey, input.leadTemp],
  };
}

export interface ConsultationGhlPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  source_type: "consultation";
  service_interest: string;
  timeframe: string;
  main_goal: string;
  source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  lead_temp: LeadTemperature;
  tags: string[];
}

export function buildConsultationGhlPayload(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceInterest: string;
  timeframe: string;
  mainGoal: string;
  source: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  leadTemp: LeadTemperature;
}): ConsultationGhlPayload {
  return {
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone,
    source_type: "consultation",
    service_interest: input.serviceInterest,
    timeframe: input.timeframe,
    main_goal: input.mainGoal,
    source: input.source,
    utm_source: input.utmSource,
    utm_medium: input.utmMedium,
    utm_campaign: input.utmCampaign,
    lead_temp: input.leadTemp,
    tags: ["consultation-form", "dessi-dollhouse"],
  };
}
