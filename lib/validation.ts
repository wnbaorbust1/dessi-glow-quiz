import { z } from "zod";

/**
 * Shared Zod schema for the consultation lead form.
 * Used by both the client (components/LeadForm.tsx) for inline validation
 * and the server (app/api/leads/route.ts) for authoritative validation.
 *
 * NOTE: This is a marketing intake form only. Do not add medical history,
 * diagnosis, or health-condition fields here.
 */

export const CONTACT_METHODS = ["text", "phone", "email"] as const;
// Matches the studio's real service menu (see components/ServicesList.tsx).
export const SERVICE_INTERESTS = [
  "Liquid BBL",
  "Lip Flip",
  "Lip Filler",
  "Botox",
  "Filler Dissolver",
  "Permanent Smile Line Correction",
  "Fat Dissolving Shots",
  "Teeth Gems",
  "Other",
] as const;
export const APPOINTMENT_TIMEFRAMES = [
  "As soon as possible",
  "Within 2 weeks",
  "Within 30 days",
  "Just researching",
] as const;

// Matches a US phone number once formatting characters are stripped:
// 10 digits, optionally preceded by a leading "1" country code.
const US_PHONE_DIGITS = /^1?\d{10}$/;

export const leadFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(80, "First name is too long."),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(80, "Last name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(1, "Mobile phone is required.")
    .refine((val) => US_PHONE_DIGITS.test(val.replace(/\D/g, "")), {
      message: "Enter a valid 10-digit US phone number.",
    }),
  preferredContact: z.enum(CONTACT_METHODS, {
    message: "Select a preferred contact method.",
  }),
  serviceInterest: z.enum(SERVICE_INTERESTS, {
    message: "Select a service you're interested in.",
  }),
  mainGoal: z
    .string()
    .trim()
    .max(1000, "Please keep this under 1000 characters.")
    .optional()
    .default(""),
  timeframe: z.enum(APPOINTMENT_TIMEFRAMES, {
    message: "Select a preferred timeframe.",
  }),
  consent: z.literal(true, {
    message: "You must agree to be contacted before submitting.",
  }),
  // Honeypot: real users never see or fill this field. Any non-empty
  // value indicates a bot submission and is silently rejected upstream.
  companyWebsite: z.string().max(0).optional().or(z.literal("")),
  // Hidden attribution fields.
  source: z.string().max(200).optional().default(""),
  campaign: z.string().max(200).optional().default(""),
  pageUrl: z.string().max(2000).optional().default(""),
  submittedAt: z.string().max(100).optional().default(""),
  // UTM parameters captured from the landing URL.
  utmSource: z.string().max(200).optional().default(""),
  utmMedium: z.string().max(200).optional().default(""),
  utmCampaign: z.string().max(200).optional().default(""),
  utmTerm: z.string().max(200).optional().default(""),
  utmContent: z.string().max(200).optional().default(""),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

/**
 * Formats a US phone number as (XXX) XXX-XXXX while the user types.
 * Non-numeric characters are stripped before formatting.
 */
export function formatUSPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const len = digits.length;

  if (len === 0) return "";
  if (len < 4) return `(${digits}`;
  if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
