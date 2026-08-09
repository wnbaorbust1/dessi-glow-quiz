import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Terms of Use | ${siteConfig.businessName}`,
  description: `Terms of use for ${siteConfig.businessName}.`,
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl text-white">Terms of Use</h1>
        <p className="mt-4 text-sm text-muted">Last updated: [add date]</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <p>
            {/*
              PLACEHOLDER CONTENT — replace with terms of use reviewed by
              your legal / compliance advisor before this page goes live.
              At minimum, cover acceptable use of the site, that content is
              informational/marketing (not medical advice), intellectual
              property, and limitation of liability.
            */}
            These Terms of Use govern your access to and use of this website operated by{" "}
            {siteConfig.businessName}. This page is a placeholder and must be completed and
            reviewed before publishing.
          </p>
          <section>
            <h2 className="font-serif text-xl text-white">Use of This Site</h2>
            <p className="mt-2">
              [Describe permitted use, that submitting the consultation form does not create a
              provider-patient relationship, and that scheduling is subject to availability.]
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-white">No Medical Advice</h2>
            <p className="mt-2">
              Content on this site is for general marketing and educational purposes only and is
              not medical advice. See our{" "}
              <a href="/medical-disclaimer" className="text-rose underline underline-offset-2">
                Medical Disclaimer
              </a>{" "}
              for details.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-white">Contact</h2>
            <p className="mt-2">
              Questions about these terms can be directed to {siteConfig.businessName} at{" "}
              {siteConfig.phone}.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
