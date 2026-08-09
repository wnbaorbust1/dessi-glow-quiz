import { Globe, Phone } from "lucide-react";
import InstagramGlyph from "@/components/icons/InstagramGlyph";
import { siteConfig } from "@/lib/site-config";

// Click tracking for the links below is handled without turning this into a
// client component: see components/AnalyticsListener.tsx, which listens for
// clicks on any [data-analytics-event] element at the document level.
export default function SocialProof() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div
        className="gold-border relative overflow-hidden rounded-md px-6 py-14 text-center sm:px-12"
        style={{
          background: "linear-gradient(135deg, #c17e6c 0%, #d9a97e 45%, #c6a06b 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: "radial-gradient(circle at 50% 0%, rgba(255,244,225,0.35), transparent 60%)",
          }}
        />
        {/* Subtle dark scrim so white text stays readable against the light
            rose-gold gradient (same technique used over photos in Hero). */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/20" />
        <div className="relative">
          <h2 className="font-serif text-3xl text-white sm:text-4xl">See More From Dessi Dollhouse</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            Follow recent work, service education, availability updates, and behind-the-scenes
            content.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="instagram_clicked"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-cream bg-cream px-6 py-3 text-sm font-semibold tracking-wide text-ink transition-transform hover:scale-[1.02] sm:w-auto"
            >
              <InstagramGlyph size={18} />
              Follow on Instagram
            </a>
            <a
              href={siteConfig.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-white/50 px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:border-white hover:bg-white/10 sm:w-auto"
            >
              <Globe size={18} aria-hidden="true" />
              Visit Our Website
            </a>
            <a
              href={siteConfig.phoneHref}
              data-analytics-event="phone_clicked"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-white/50 px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:border-white hover:bg-white/10 sm:w-auto"
            >
              <Phone size={18} aria-hidden="true" />
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
