import { Suspense } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import QuizShell from "@/components/quiz/QuizShell";
import LeadForm from "@/components/LeadForm";
import ResultsGallery from "@/components/ResultsGallery";
import ServiceOverview from "@/components/ServiceOverview";
import ServicesList from "@/components/ServicesList";
import WhyChooseUs from "@/components/WhyChooseUs";
import ClientJourney from "@/components/ClientJourney";
import SocialProof from "@/components/SocialProof";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { siteConfig } from "@/lib/site-config";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.businessName,
  // No approved studio photo supplied yet — add one to /public/images/
  // and restore an "image" field here once available (Google recommends
  // including one for LocalBusiness rich results, but a 404'ing URL is
  // worse than omitting the field).
  url: siteConfig.canonicalUrl,
  telephone: siteConfig.phoneHref.replace("tel:", ""),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Austin",
    addressRegion: "TX",
    addressCountry: "US",
  },
  areaServed: ["Austin, TX", "Pflugerville, TX"],
  sameAs: [siteConfig.instagramUrl, siteConfig.website],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Liquid BBL Consultation",
  serviceType: "Liquid BBL Consultation",
  provider: {
    "@type": "LocalBusiness",
    name: siteConfig.businessName,
  },
  areaServed: ["Austin, TX", "Pflugerville, TX"],
  url: siteConfig.canonicalUrl,
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is a consultation required?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. A consultation helps the provider learn about your goals, discuss eligibility, review possible risks and alternatives, and explain what to expect.",
      },
    },
    {
      "@type": "Question",
      name: "How soon can I book?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Availability varies. Submit the consultation form or review current openings through the Square booking page.",
      },
    },
    {
      "@type": "Question",
      name: "How much does the service cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing depends on the treatment plan and the amount of product or number of sessions recommended. The team can discuss current pricing after learning more about your goals.",
      },
    },
    {
      "@type": "Question",
      name: "How long do results last?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Duration varies by treatment method, product, individual response, lifestyle, and follow-up care. The provider can explain realistic expectations during your consultation.",
      },
    },
    {
      "@type": "Question",
      name: "Is there downtime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Recovery experiences vary. Your provider should explain possible swelling, tenderness, activity restrictions, aftercare, warning signs, and follow-up requirements before treatment.",
      },
    },
    {
      "@type": "Question",
      name: "Am I guaranteed a specific result?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Results vary, and no specific outcome can be guaranteed.",
      },
    },
    {
      "@type": "Question",
      name: "Can I book directly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You may request a consultation through this page or view current availability through the Square booking link.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      {/* Do not include unverified star ratings or review counts in this JSON-LD. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <AnnouncementBar />
      <Header />

      <main id="main-content">
        <Hero />

        {/* ── Glow Quiz ───────────────────────────────────────── */}
        <section
          id="glow-quiz"
          className="border-b border-rose/15"
          style={{
            background: "linear-gradient(180deg, #fef4f0 0%, #fff5f2 100%)",
          }}
        >
          <div className="mx-auto max-w-3xl px-4 pb-8 pt-14 text-center sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose">
              Free &middot; 60 Seconds
            </p>
            <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
              The Dollhouse Glow Quiz
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              Answer a few questions and we&apos;ll match you with the treatment most aligned with
              your beauty goals.
            </p>
          </div>
          <Suspense fallback={<QuizFallback />}>
            <QuizShell />
          </Suspense>
        </section>

        <section id="lead-form" className="bg-cream">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
            <Suspense fallback={<LeadFormFallback />}>
              <LeadForm />
            </Suspense>
          </div>
        </section>

        <ResultsGallery />
        <ServiceOverview />
        <ServicesList />
        <WhyChooseUs />
        <ClientJourney />
        <SocialProof />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
      <StickyMobileCTA />
    </>
  );
}

function LeadFormFallback() {
  return (
    <div className="gold-border h-[420px] animate-pulse rounded-md bg-cream-surface" aria-hidden="true" />
  );
}

function QuizFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full"
        style={{ border: "2px solid rgba(193,126,108,0.2)", borderTopColor: "var(--color-rose)" }}
        aria-label="Loading quiz"
      />
    </div>
  );
}
