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
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: siteConfig.canonicalUrl,
    siteName: siteConfig.businessName,
    locale: "en_US",
    type: "website",
    images: [
      {
        // Replace with an approved, high-resolution studio or brand image
        // sized 1200x630 for optimal Open Graph rendering.
        url: "/images/hero-result.jpg",
        width: 1200,
        height: 630,
        alt: "Dessi Dollhouse Aesthetics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/images/hero-result.jpg"],
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
