import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Which Dollhouse Treatment Is Right for You? | Dessi Dollhouse",
  description:
    "Take the free 60-second Dessi Dollhouse Glow Quiz and discover which beauty treatment may align with your glow goals.",
  openGraph: {
    title: "Which Dollhouse Treatment Is Right for You? | Dessi Dollhouse",
    description:
      "Take the free 60-second Dessi Dollhouse Glow Quiz and discover which beauty treatment may align with your glow goals.",
    siteName: siteConfig.businessName,
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/hero-result.jpg", width: 1200, height: 630 }],
  },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Minimal quiz header */}
      <header
        className="border-b"
        style={{ borderColor: "rgba(198,160,107,0.15)", background: "rgba(20,20,20,0.95)" }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/logo.png"
              alt="Dessi Dollhouse"
              width={32}
              height={32}
              className="rounded-full"
              style={{ border: "1px solid rgba(198,160,107,0.4)" }}
            />
            <span
              className="font-serif text-sm"
              style={{ color: "var(--color-cream)" }}
            >
              Dessi Dollhouse
            </span>
          </Link>
          <span
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: "var(--color-gold)", letterSpacing: "0.18em" }}
          >
            Glow Quiz
          </span>
        </div>
      </header>

      <main id="main-content">{children}</main>

      <footer className="border-t py-6 text-center" style={{ borderColor: "rgba(198,160,107,0.1)" }}>
        <p className="text-xs" style={{ color: "var(--color-muted-warm)" }}>
          Quiz results are for educational and promotional purposes only and do not constitute
          medical advice or determine treatment eligibility.{" "}
          <Link href="/medical-disclaimer" className="underline hover:opacity-80">
            Medical Disclaimer
          </Link>
        </p>
        <p className="mt-2 text-xs" style={{ color: "rgba(138,122,110,0.6)" }}>
          © {new Date().getFullYear()} {siteConfig.businessName} · Pflugerville, TX
        </p>
      </footer>
    </div>
  );
}
