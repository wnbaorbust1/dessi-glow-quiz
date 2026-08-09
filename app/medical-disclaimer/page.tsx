import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Medical Disclaimer | ${siteConfig.businessName}`,
  description: `Medical disclaimer for ${siteConfig.businessName}.`,
};

export default function MedicalDisclaimerPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl text-white">Medical Disclaimer</h1>
        <p className="mt-4 text-sm text-muted">Last updated: [add date]</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <p>
            {/*
              PLACEHOLDER CONTENT — this disclaimer, and all medical or
              advertising claims on this site, MUST be reviewed by the
              licensed provider and a legal / compliance advisor before
              publishing.
            */}
            Information on this website is for general marketing and educational purposes and is
            not medical advice. It is not a substitute for professional medical evaluation,
            diagnosis, or treatment.
          </p>
          <section>
            <h2 className="font-serif text-xl text-white">Consultations</h2>
            <p className="mt-2">
              A consultation does not guarantee treatment eligibility. Eligibility, treatment
              planning, risks, alternatives, and expected outcomes should be discussed directly
              with the provider during an individual evaluation.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-white">Results and Risks</h2>
            <p className="mt-2">
              All procedures involve potential risks. Results vary by individual and cannot be
              guaranteed. Photos on this site are shown with client permission and may reflect
              temporary swelling or immediate post-treatment appearance rather than final results.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-white">Emergencies</h2>
            <p className="mt-2">
              [Add guidance for what a client should do in the event of a post-treatment
              complication or emergency, reviewed by the licensed provider.]
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
