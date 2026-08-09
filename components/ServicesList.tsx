import {
  Crown,
  Droplet,
  FlaskConical,
  Flame,
  Gem,
  PersonStanding,
  ScanFace,
  Smile,
  Sparkles,
  Syringe,
  Wand2,
} from "lucide-react";

// Full service menu, matching the studio's real marketing materials.
const SERVICES = [
  { icon: Smile, label: "Lip Flip" },
  { icon: Droplet, label: "Lip Filler" },
  { icon: Syringe, label: "Botox" },
  { icon: FlaskConical, label: "Filler Dissolver" },
  { icon: ScanFace, label: "Permanent Smile Line Correction" },
  { icon: PersonStanding, label: "Liquid BBL" },
  { icon: Flame, label: "Fat Dissolving Shots" },
  { icon: Gem, label: "Teeth Gems" },
];

const PROMISE = [
  { icon: Sparkles, label: "Beauty", sub: "Enhanced" },
  { icon: Crown, label: "Confidence", sub: "Restored" },
  { icon: Wand2, label: "Transformation", sub: "Begins" },
];

export default function ServicesList() {
  return (
    <section className="border-y border-rose/10 bg-cream-surface">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-lg italic text-rose sm:text-xl">
            Luxury Aesthetics &amp; Beauty Enhancements
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Our Services</h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-4">
          {PROMISE.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-full border border-gold/40 bg-white">
                <Icon size={20} className="text-gold" aria-hidden="true" />
              </div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink">
                {label}
              </p>
              <p className="text-xs uppercase tracking-wide text-rose">{sub}</p>
            </div>
          ))}
        </div>

        <div className="section-divider mx-auto mt-12 max-w-3xl" />

        <ul className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
          {SERVICES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 border-b border-rose/15 pb-3 text-sm text-ink sm:text-base"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose/10">
                <Icon size={16} className="text-rose" aria-hidden="true" />
              </span>
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <a
            href="#lead-form"
            className="inline-flex items-center justify-center rounded-sm border border-gold/50 px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-colors hover:border-gold hover:text-gold-soft"
          >
            Ask About Any of These
          </a>
        </div>
      </div>
    </section>
  );
}
