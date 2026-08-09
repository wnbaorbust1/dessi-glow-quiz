import { Sparkles, Clock, Shield } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

interface Props {
  onStart: () => void;
  refCode?: string;
}

export default function QuizIntro({ onStart, refCode }: Props) {
  return (
    <div className="animate-reveal text-center">
      {/* Eyebrow */}
      <p
        className="text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: "var(--color-rose)" }}
      >
        {siteConfig.businessName} · Pflugerville, TX
      </p>

      {/* Headline */}
      <h1
        className="mt-5 font-serif text-4xl leading-tight text-ink sm:text-5xl"
      >
        Which Dollhouse{" "}
        <span className="gold-gradient-text">Treatment</span>{" "}
        Is Right for You?
      </h1>

      {/* Subheadline */}
      <p
        className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
      >
        Take our free 60-second Glow Quiz and discover which Desi Dollhouse
        treatment may best match your beauty goals.
      </p>

      {/* Trust badges */}
      <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row sm:max-w-none sm:justify-center">
        {[
          { icon: Clock, text: "60 seconds" },
          { icon: Sparkles, text: "Personalized match" },
          { icon: Shield, text: "No medical advice" },
        ].map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-center justify-center gap-2 rounded-sm px-4 py-2.5"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(193,126,108,0.2)",
            }}
          >
            <Icon size={15} style={{ color: "var(--color-gold-soft)" }} aria-hidden="true" />
            <span className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* Ambassador banner */}
      {refCode && (
        <div
          className="mx-auto mt-6 max-w-sm rounded-sm px-4 py-3 text-xs"
          style={{
            background: "rgba(193,126,108,0.1)",
            border: "1px solid rgba(193,126,108,0.3)",
            color: "var(--color-rose-soft)",
          }}
        >
          You were referred by a Desi Dollhouse ambassador ✨
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onStart}
        className="mx-auto mt-8 flex items-center gap-2 rounded-sm px-10 py-4 text-sm font-bold uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.99]"
        style={{
          background: "linear-gradient(135deg, var(--color-rose) 0%, #a8604e 100%)",
          color: "var(--color-cream)",
          letterSpacing: "0.15em",
          boxShadow: "0 4px 24px rgba(193,126,108,0.25)",
        }}
      >
        <Sparkles size={16} aria-hidden="true" />
        Take the Glow Quiz
      </button>

      {/* Decorative line */}
      <div className="section-divider mx-auto mt-12 max-w-xs" />

      <p
        className="mt-6 text-xs leading-relaxed"
        style={{ color: "rgba(138,122,110,0.8)" }}
      >
        Results are for educational and promotional purposes only and do not
        constitute medical advice or determine treatment eligibility.
      </p>
    </div>
  );
}
