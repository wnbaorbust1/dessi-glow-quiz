"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import {
  APPOINTMENT_TIMEFRAMES,
  CONTACT_METHODS,
  SERVICE_INTERESTS,
  formatUSPhone,
  leadFormSchema,
} from "@/lib/validation";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: (typeof CONTACT_METHODS)[number] | "";
  serviceInterest: (typeof SERVICE_INTERESTS)[number] | "";
  mainGoal: string;
  timeframe: (typeof APPOINTMENT_TIMEFRAMES)[number] | "";
  consent: boolean;
  // Honeypot — left blank by real visitors, hidden from sighted and screen-reader users.
  companyWebsite: string;
};

const INITIAL_STATE: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredContact: "",
  serviceInterest: "",
  mainGoal: "",
  timeframe: "",
  consent: false,
  companyWebsite: "",
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function LeadForm() {
  const searchParams = useSearchParams();
  const [values, setValues] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const hasStartedRef = useRef(false);

  const utm = {
    utmSource: searchParams.get("utm_source") ?? "",
    utmMedium: searchParams.get("utm_medium") ?? "",
    utmCampaign: searchParams.get("utm_campaign") ?? "",
    utmTerm: searchParams.get("utm_term") ?? "",
    utmContent: searchParams.get("utm_content") ?? "",
  };

  function handleFirstInteraction() {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackEvent("consultation_form_started");
    }
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    handleFirstInteraction();
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting" || status === "success") return; // prevent duplicate submissions

    const pageUrl = typeof window !== "undefined" ? window.location.href : "";

    const payload = {
      ...values,
      source: "landing-page",
      campaign: utm.utmCampaign || "direct",
      pageUrl,
      submittedAt: new Date().toISOString(),
      ...utm,
    };

    const result = leadFormSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormState;
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus("error");
      setErrorMessage("Please correct the highlighted fields and try again.");
      return;
    }

    setErrors({});
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      trackEvent("consultation_form_submitted", {
        service_interest: values.serviceInterest,
        timeframe: values.timeframe,
      });
    } catch {
      setStatus("error");
      setErrorMessage(
        "Something went wrong sending your request. Please try again, or call us directly."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="gold-border animate-reveal flex flex-col items-center gap-4 rounded-md bg-cream-surface px-6 py-12 text-center"
      >
        <CheckCircle2 size={40} className="text-rose" aria-hidden="true" />
        <h3 className="font-serif text-2xl text-ink">Thank you.</h3>
        <p className="max-w-md text-sm leading-relaxed text-muted-warm">
          Your request has been received. The Dessi Dollhouse team will contact you about
          consultation availability and next steps.
        </p>
        <a
          href={siteConfig.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("square_booking_clicked", { context: "lead-form-success" })}
          className="mt-2 inline-flex items-center justify-center rounded-sm border border-rose bg-rose px-6 py-3 text-sm font-semibold tracking-wide text-ink transition-transform hover:scale-[1.02] hover:bg-rose-soft"
        >
          View Current Booking Availability
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="gold-border rounded-md bg-cream-surface p-6 sm:p-8">
      <h3 className="font-serif text-2xl text-ink sm:text-3xl">Start Your Consultation Request</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-warm">
        Share a few details and the Dessi Dollhouse team will contact you about availability and
        next steps.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstName" error={errors.firstName}>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={values.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            className={inputClass(!!errors.firstName)}
            aria-invalid={!!errors.firstName}
            required
          />
        </Field>

        <Field label="Last name" htmlFor="lastName" error={errors.lastName}>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={values.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            className={inputClass(!!errors.lastName)}
            aria-invalid={!!errors.lastName}
            required
          />
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClass(!!errors.email)}
            aria-invalid={!!errors.email}
            required
          />
        </Field>

        <Field label="Mobile phone" htmlFor="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(512) 555-0123"
            value={values.phone}
            onChange={(e) => updateField("phone", formatUSPhone(e.target.value))}
            className={inputClass(!!errors.phone)}
            aria-invalid={!!errors.phone}
            required
          />
        </Field>

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium text-ink">Preferred contact method</legend>
          <div className="flex flex-wrap gap-3">
            {CONTACT_METHODS.map((method) => (
              <label
                key={method}
                className={`cursor-pointer rounded-sm border px-4 py-2 text-sm capitalize transition-colors ${
                  values.preferredContact === method
                    ? "border-rose bg-rose/10 text-rose"
                    : "border-ink/15 text-muted-warm hover:border-rose/50"
                }`}
              >
                <input
                  type="radio"
                  name="preferredContact"
                  value={method}
                  checked={values.preferredContact === method}
                  onChange={() => updateField("preferredContact", method)}
                  className="sr-only"
                />
                {method}
              </label>
            ))}
          </div>
          {errors.preferredContact && <ErrorText>{errors.preferredContact}</ErrorText>}
        </fieldset>

        <Field label="Service interest" htmlFor="serviceInterest" error={errors.serviceInterest}>
          <select
            id="serviceInterest"
            name="serviceInterest"
            value={values.serviceInterest}
            onChange={(e) => updateField("serviceInterest", e.target.value as FormState["serviceInterest"])}
            className={inputClass(!!errors.serviceInterest)}
            aria-invalid={!!errors.serviceInterest}
            required
          >
            <option value="" disabled>
              Select a service
            </option>
            {SERVICE_INTERESTS.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Preferred appointment timeframe" htmlFor="timeframe" error={errors.timeframe}>
          <select
            id="timeframe"
            name="timeframe"
            value={values.timeframe}
            onChange={(e) => updateField("timeframe", e.target.value as FormState["timeframe"])}
            className={inputClass(!!errors.timeframe)}
            aria-invalid={!!errors.timeframe}
            required
          >
            <option value="" disabled>
              Select a timeframe
            </option>
            {APPOINTMENT_TIMEFRAMES.map((timeframe) => (
              <option key={timeframe} value={timeframe}>
                {timeframe}
              </option>
            ))}
          </select>
        </Field>

        <Field label="What's your main goal?" htmlFor="mainGoal" error={errors.mainGoal} full>
          <textarea
            id="mainGoal"
            name="mainGoal"
            rows={4}
            value={values.mainGoal}
            onChange={(e) => updateField("mainGoal", e.target.value)}
            className={inputClass(!!errors.mainGoal)}
            aria-invalid={!!errors.mainGoal}
          />
        </Field>

        {/* Honeypot field: hidden from real users via CSS + tabIndex, not via
            display:none, so basic bots that skip hidden inputs still fill it. */}
        <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="companyWebsite">Company website</label>
          <input
            id="companyWebsite"
            name="companyWebsite"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.companyWebsite}
            onChange={(e) => setValues((prev) => ({ ...prev, companyWebsite: e.target.value }))}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted-warm">
            <input
              type="checkbox"
              name="consent"
              checked={values.consent}
              onChange={(e) => updateField("consent", e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-[#C17E6C]"
              aria-invalid={!!errors.consent}
              required
            />
            <span>
              By submitting this form, I agree that Dessi Dollhouse Aesthetics may contact me by
              phone, text, or email regarding my request. Message and data rates may apply.
              Consent is not a condition of purchase.
            </span>
          </label>
          {errors.consent && <ErrorText>{errors.consent}</ErrorText>}
        </div>
      </div>

      <div aria-live="polite" className="mt-4 min-h-[1.5rem]">
        {status === "error" && errorMessage && (
          <p className="flex items-center gap-2 text-sm text-error">
            <TriangleAlert size={16} aria-hidden="true" />
            {errorMessage}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-rose bg-rose px-7 py-3.5 text-sm font-semibold tracking-wide text-ink transition-transform hover:scale-[1.01] hover:bg-rose-soft disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {status === "submitting" ? "Sending request…" : "Request My Consultation"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
  full,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-xs text-error" role="alert">
      {children}
    </p>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-sm border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-warm/60 focus:outline-none ${
    hasError ? "border-error" : "border-ink/15 focus:border-rose"
  }`;
}
