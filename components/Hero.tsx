import Image from "next/image";
import { CalendarCheck2, MapPin, Sparkles } from "lucide-react";

const TRUST_POINTS = [
  { icon: Sparkles, label: "Personalized consultations" },
  { icon: MapPin, label: "Austin-area appointments" },
  { icon: CalendarCheck2, label: "Direct Square booking" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-rose/15">
      {/* Soft blush + gold radial gradient backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 15%, rgba(212,137,122,0.18), transparent 45%), radial-gradient(circle at 85% 65%, rgba(200,163,107,0.14), transparent 40%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div className="animate-reveal">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose">
            Austin &amp; Pflugerville Aesthetic Services
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
            Enhance Your Shape With a{" "}
            <span className="gold-gradient-text">Personalized Liquid BBL</span> Consultation
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Explore a customized approach designed around your body goals, treatment eligibility,
            and desired outcome at Dessi Dollhouse Aesthetics.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#glow-quiz"
              className="inline-flex items-center justify-center rounded-sm border border-rose bg-rose px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-transform hover:scale-[1.02] hover:bg-rose-soft"
            >
              Take the Glow Quiz
            </a>
            <a
              href="#results"
              className="inline-flex items-center justify-center rounded-sm border border-gold/50 px-7 py-3.5 text-sm font-semibold tracking-wide text-ink transition-colors hover:border-gold hover:text-gold"
            >
              View Client Results
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-sm border border-rose/20 bg-white/70 px-4 py-3"
              >
                <Icon size={18} className="shrink-0 text-rose" aria-hidden="true" />
                <dt className="sr-only">Trust point</dt>
                <dd className="text-xs font-medium text-muted sm:text-sm">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative animate-reveal">
          <div
            className="relative aspect-[4/5] w-full overflow-hidden rounded-md border border-rose/20 bg-cream shadow-[0_0_60px_rgba(193,126,108,0.12)]"
          >
            <Image
              src="/images/hero-result.jpg"
              alt="Studio result photo from Dessi Dollhouse Aesthetics, shown with client permission"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-rose/20 via-transparent to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
