import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.businessName}`,
  description: `Privacy policy for ${siteConfig.businessName}.`,
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl text-white">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted">Last updated: [add date]</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <p>
            {/*
              PLACEHOLDER CONTENT — replace with a privacy policy reviewed by
              your legal / compliance advisor before this page goes live.
              At minimum it should describe what information is collected
              through the consultation form, how it is used and stored, who
              it is shared with (e.g. CRM, scheduling, or SMS/email
              providers), and how a visitor can request deletion of their
              information.
            */}
            This Privacy Policy explains how {siteConfig.businessName} collects, uses, and
            protects information submitted through this website, including the consultation
            request form. This page is a placeholder and must be completed and reviewed before
            publishing.
          </p>
          <section>
            <h2 className="font-serif text-xl text-white">Information We Collect</h2>
            <p className="mt-2">
              [Describe form fields collected: name, email, phone, service interest, and any
              other data captured, including analytics/cookies if applicable.]
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-white">How We Use Information</h2>
            <p className="mt-2">
              [Describe use: responding to consultation requests, scheduling, marketing
              communications, and any third-party tools used (CRM, email/SMS providers).]
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-white">Contact</h2>
            <p className="mt-2">
              Questions about this policy can be directed to {siteConfig.businessName} at{" "}
              {siteConfig.phone}.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
