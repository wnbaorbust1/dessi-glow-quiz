"use client";

import { useState } from "react";
import { CalendarCheck2, Share2, Copy, Check, Sparkles, ChevronRight } from "lucide-react";
import type { QuizResult, LeadTemperature } from "@/lib/quiz-types";
import { siteConfig } from "@/lib/site-config";

interface Props {
  result: QuizResult;
  leadTemp: LeadTemperature;
  matchedAnswers: string[];
  leadId: string | null;
  onBookingClick: () => void;
  sessionId: string;
  utm: Record<string, string>;
}

export default function QuizResultView({ result, matchedAnswers, onBookingClick }: Props) {
  const [copied, setCopied] = useState(false);

  const quizUrl =
    typeof window !== "undefined" ? `${window.location.origin}/glow-quiz` : "/glow-quiz";

  const shareText = `I got ${result.dollName} ${result.emoji} on the Desi Dollhouse Glow Quiz!\n\nMy match: ${result.serviceMatch}\n\nTake it here: ${quizUrl}`;

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I'm ${result.dollName}! | Desi Dollhouse Glow Quiz`,
          text: shareText,
          url: quizUrl,
        });
        return;
      } catch {
        // fall through
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // clipboard unavailable
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // unavailable
    }
  }

  return (
    <div className="animate-reveal space-y-6">

      {/* ── Hero result card ─────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl px-6 pb-8 pt-10 text-center"
        style={{
          background: "linear-gradient(145deg, #fde8e0 0%, #f9ddd6 50%, #fbeadf 100%)",
          border: "1.5px solid rgba(193,126,108,0.25)",
          boxShadow: "0 8px 40px rgba(193,126,108,0.12)",
        }}
      >
        {/* Decorative circle accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #d9a493, transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #c6a06b, transparent 70%)" }}
        />

        <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-rose">
          Your Dollhouse Match
        </p>

        <div className="relative mt-4 text-7xl" role="img" aria-label={result.emoji}>
          {result.emoji}
        </div>

        <h1 className="relative mt-3 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
          {result.dollName}
        </h1>

        <p className="relative mt-1 text-sm font-semibold uppercase tracking-[0.15em] text-rose">
          {result.serviceMatch}
        </p>

        <p className="relative mx-auto mt-4 max-w-xs font-serif text-lg italic leading-relaxed text-muted-warm">
          &ldquo;{result.tagline}&rdquo;
        </p>
      </div>

      {/* ── About this service ───────────────────────────── */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "#fff",
          border: "1.5px solid rgba(193,126,108,0.18)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={15} className="text-rose" aria-hidden="true" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-rose">
            About {result.serviceMatch}
          </h2>
        </div>
        <p className="text-sm leading-[1.8] text-ink">{result.description}</p>

        {/* Benefits list */}
        <ul className="mt-5 space-y-3">
          {result.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-ink">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: "var(--color-rose)" }}
                aria-hidden="true"
              >
                ✓
              </span>
              <span className="leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Why you matched ──────────────────────────────── */}
      {matchedAnswers.length > 0 && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: "#fff",
            border: "1.5px solid rgba(193,126,108,0.18)",
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
          }}
        >
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-rose">
            Why You Matched
          </h2>
          <p className="mb-4 text-sm leading-[1.8] text-ink">{result.whyYouMatched}</p>
          <ul className="space-y-2">
            {matchedAnswers.map((answer, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <ChevronRight size={14} className="mt-0.5 shrink-0 text-rose" aria-hidden="true" />
                {answer}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: "linear-gradient(145deg, #fde8e0 0%, #fff5f2 100%)",
          border: "1.5px solid rgba(193,126,108,0.2)",
        }}
      >
        <h2 className="mb-1 font-serif text-xl text-ink">Ready to take the next step?</h2>
        <p className="mb-5 text-sm leading-relaxed text-muted">{result.nextStep}</p>

        <a
          href={siteConfig.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onBookingClick}
          className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #c17e6c 0%, #a86050 100%)",
            boxShadow: "0 6px 24px rgba(193,126,108,0.35)",
            letterSpacing: "0.1em",
          }}
        >
          <CalendarCheck2 size={16} aria-hidden="true" />
          Book My Consultation
        </a>

        <p className="mt-3 text-xs text-muted">
          Or call{" "}
          <a href={siteConfig.phoneHref} className="font-semibold text-rose hover:underline">
            {siteConfig.phone}
          </a>
        </p>
      </div>

      {/* ── Disclaimer ───────────────────────────────────── */}
      <div
        className="rounded-xl px-5 py-4 text-xs leading-relaxed text-muted"
        style={{
          background: "rgba(193,126,108,0.05)",
          border: "1px solid rgba(193,126,108,0.15)",
        }}
      >
        <strong className="text-ink">Important:</strong> This quiz result is for educational and
        promotional purposes only. It describes a potential service match based on your answers —
        it is not medical advice and does not determine your eligibility for any treatment. All
        procedures carry potential risks. Please consult a qualified provider before making any
        treatment decision.
      </div>

      {/* ── Share ────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "#fff",
          border: "1.5px solid rgba(193,126,108,0.18)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
        }}
      >
        <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-rose">
          Share Your Match
        </h2>
        <p className="mb-4 text-xs text-muted">Show your friends which Dollhouse Doll you are.</p>

        {/* Share card preview */}
        <div
          className="mb-4 rounded-xl p-5 text-center"
          style={{
            background: "linear-gradient(145deg, #fde8e0, #f9ddd6)",
            border: "1px solid rgba(193,126,108,0.2)",
          }}
        >
          <p className="text-xs font-medium text-muted">Desi Dollhouse · Pflugerville, TX</p>
          <p className="mt-2 text-4xl">{result.emoji}</p>
          <p className="mt-1 font-serif text-lg font-semibold text-ink">
            I&apos;m {result.dollName}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-rose">
            My match: {result.serviceMatch}
          </p>
          <p className="mt-3 text-xs text-muted">Take the Dollhouse Glow Quiz →</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose/25 py-3 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-rose hover:text-rose"
          >
            <Share2 size={13} aria-hidden="true" />
            Share
          </button>
          <button
            onClick={copyToClipboard}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose/25 py-3 text-xs font-semibold uppercase tracking-wider transition-colors hover:border-rose"
            style={{ color: copied ? "var(--color-rose)" : "var(--color-ink)" }}
          >
            {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Retake */}
      <p className="text-center text-xs text-muted">
        <a href="/glow-quiz" className="underline transition-opacity hover:opacity-70">
          Retake the quiz
        </a>
      </p>
    </div>
  );
}
