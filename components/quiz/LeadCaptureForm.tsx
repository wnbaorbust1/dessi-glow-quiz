"use client";

import { useState, type FormEvent } from "react";
import { ChevronLeft, Loader2, TriangleAlert } from "lucide-react";
import { formatUSPhone } from "@/lib/validation";

interface Props {
  onSubmit: (data: {
    firstName: string;
    email: string;
    phone: string;
    zip: string;
    marketingConsent: boolean;
  }) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

interface FormState {
  firstName: string;
  email: string;
  phone: string;
  zip: string;
  marketingConsent: boolean;
}

const INITIAL: FormState = {
  firstName: "",
  email: "",
  phone: "",
  zip: "",
  marketingConsent: false,
};

export default function LeadCaptureForm({ onSubmit, onBack, isSubmitting }: Props) {
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState("");

  function validate() {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!values.firstName.trim()) errs.firstName = "First name is required.";
    if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      errs.email = "A valid email is required.";
    return errs;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError("");

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    try {
      await onSubmit({
        firstName: values.firstName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        zip: values.zip.trim(),
        marketingConsent: values.marketingConsent,
      });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="animate-reveal">
      {/* Heading */}
      <p
        className="mb-1 text-xs font-semibold uppercase tracking-[0.18em]"
        style={{ color: "var(--color-rose)" }}
      >
        Almost there
      </p>
      <h2
        className="mb-2 font-serif text-3xl sm:text-4xl"
        style={{ color: "var(--color-cream)" }}
      >
        Where Should We Send Your Match?
      </h2>
      <p className="mb-8 text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
        Enter your info below to reveal your personalized Dollhouse result.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4 rounded-md p-6 sm:p-8"
        style={{
          background: "rgba(198,160,107,0.04)",
          border: "1px solid rgba(198,160,107,0.2)",
        }}
      >
        {/* First name */}
        <div>
          <label
            htmlFor="lc-firstName"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-muted)" }}
          >
            First Name <span style={{ color: "var(--color-rose)" }}>*</span>
          </label>
          <input
            id="lc-firstName"
            type="text"
            autoComplete="given-name"
            value={values.firstName}
            onChange={(e) => setValues((p) => ({ ...p, firstName: e.target.value }))}
            className="w-full rounded-sm px-4 py-3 text-sm"
            style={inputStyle(!!errors.firstName)}
            aria-invalid={!!errors.firstName}
            required
          />
          {errors.firstName && <FieldError>{errors.firstName}</FieldError>}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="lc-email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-muted)" }}
          >
            Email <span style={{ color: "var(--color-rose)" }}>*</span>
          </label>
          <input
            id="lc-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
            className="w-full rounded-sm px-4 py-3 text-sm"
            style={inputStyle(!!errors.email)}
            aria-invalid={!!errors.email}
            required
          />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </div>

        {/* Phone (optional) */}
        <div>
          <label
            htmlFor="lc-phone"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-muted)" }}
          >
            Mobile Phone{" "}
            <span style={{ color: "rgba(138,122,110,0.7)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
              (optional)
            </span>
          </label>
          <input
            id="lc-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(512) 555-0123"
            value={values.phone}
            onChange={(e) => setValues((p) => ({ ...p, phone: formatUSPhone(e.target.value) }))}
            className="w-full rounded-sm px-4 py-3 text-sm"
            style={inputStyle(false)}
          />
        </div>

        {/* ZIP (optional) */}
        <div>
          <label
            htmlFor="lc-zip"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-muted)" }}
          >
            ZIP Code{" "}
            <span style={{ color: "rgba(138,122,110,0.7)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
              (optional)
            </span>
          </label>
          <input
            id="lc-zip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            value={values.zip}
            onChange={(e) => setValues((p) => ({ ...p, zip: e.target.value.replace(/\D/g, "").slice(0, 5) }))}
            className="w-full rounded-sm px-4 py-3 text-sm"
            style={inputStyle(false)}
          />
        </div>

        {/* Marketing consent — NOT pre-selected */}
        <label
          className="flex cursor-pointer items-start gap-3 rounded-sm p-3 transition-colors"
          style={{ background: "rgba(198,160,107,0.04)" }}
        >
          <input
            type="checkbox"
            checked={values.marketingConsent}
            onChange={(e) => setValues((p) => ({ ...p, marketingConsent: e.target.checked }))}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer"
            style={{ accentColor: "var(--color-rose)" }}
          />
          <span className="text-xs leading-relaxed" style={{ color: "var(--color-muted-warm)" }}>
            I&apos;d like to receive my personalized Dollhouse match and occasional beauty tips from
            Desi Dollhouse by email. I can unsubscribe at any time. Consent is not required to
            receive your quiz result.
          </span>
        </label>

        {/* Error */}
        {submitError && (
          <div
            className="flex items-center gap-2 rounded-sm px-4 py-3 text-sm"
            style={{ background: "rgba(179,69,61,0.1)", color: "var(--color-error)" }}
            role="alert"
          >
            <TriangleAlert size={15} aria-hidden="true" />
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-sm py-4 text-sm font-bold uppercase tracking-widest transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: isSubmitting
              ? "rgba(193,126,108,0.6)"
              : "linear-gradient(135deg, var(--color-rose) 0%, #a8604e 100%)",
            color: "var(--color-cream)",
            letterSpacing: "0.15em",
          }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              Revealing your match…
            </span>
          ) : (
            "Reveal My Dollhouse Match →"
          )}
        </button>

        <p className="text-center text-xs" style={{ color: "rgba(138,122,110,0.7)" }}>
          No spam. Your info is never sold or shared.
        </p>
      </form>

      <button
        onClick={onBack}
        className="mt-4 flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
        style={{ color: "var(--color-muted-warm)" }}
      >
        <ChevronLeft size={14} aria-hidden="true" />
        Back to quiz
      </button>
    </div>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-xs" style={{ color: "var(--color-error)" }} role="alert">
      {children}
    </p>
  );
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    background: "rgba(20,20,20,0.8)",
    border: `1px solid ${hasError ? "var(--color-error)" : "rgba(198,160,107,0.25)"}`,
    color: "var(--color-cream)",
    outline: "none",
  };
}
