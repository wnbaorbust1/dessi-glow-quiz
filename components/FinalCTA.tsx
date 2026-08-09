import { Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-y border-gold/15">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(198,160,107,0.1) 0%, rgba(10,10,10,0) 60%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="font-serif text-lg italic text-rose-soft sm:text-xl">
          Your Glow Era Starts Here
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
          Ready to Discuss Your Body Goals?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Request a personalized consultation and learn about available options, eligibility,
          pricing, and next steps.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#lead-form"
            className="inline-flex w-full items-center justify-center rounded-sm border border-rose bg-rose px-7 py-3.5 text-sm font-semibold tracking-wide text-ink transition-transform hover:scale-[1.02] hover:bg-rose-soft sm:w-auto"
          >
            Request a Consultation
          </a>
          <a
            href={siteConfig.phoneHref}
            data-analytics-event="phone_clicked"
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-gold/50 px-7 py-3.5 text-sm font-semibold tracking-wide text-ink transition-colors hover:border-rose hover:text-rose sm:w-auto"
          >
            <Phone size={16} aria-hidden="true" />
            Call the Studio
          </a>
        </div>
      </div>
    </section>
  );
}
