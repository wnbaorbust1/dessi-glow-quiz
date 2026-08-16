import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import AnalyticsListener from "@/components/AnalyticsListener";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const pageTitle = "Liquid BBL Consultation in Austin, TX | Dessi Dollhouse Aesthetics";
const pageDescription =
  "Request a personalized Liquid BBL consultation with Dessi Dollhouse Aesthetics, serving the Austin and Pflugerville area. Explore client results and current booking availability.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.canonicalUrl),
  title: pageTitle,
  description: pageDescription,
  alternates: {
    // Placeholder canonical URL — confirm the final production domain
    // before launch (see README "Set the canonical domain").
    canonical: siteConfig.canonicalUrl,
  },
  // No approved, high-resolution studio/brand photo has been supplied yet
  // for Open Graph / Twitter cards (ideally 1200x630). Once you have one,
  // add it to /public/images/ and set openGraph.images / twitter.images
  // here — omitting them for now avoids link previews showing a 404.
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: siteConfig.canonicalUrl,
    siteName: siteConfig.businessName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: pageTitle,
    description: pageDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <body className="bg-bg text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:border focus:border-gold focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to main content
        </a>
        <AnalyticsListener />
        {children}
      </body>
    </html>
  );
}
