import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

// No approved, high-resolution photo has been supplied yet for the Open
// Graph card (ideally 1200x630) — add one to /public/images/ and set
// openGraph.images once available; omitting it for now avoids link
// previews showing a 404.
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
            {/* LOGO: no approved logo file yet — text wordmark for now. */}
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
