import Image from "next/image";
import Link from "next/link";
import { Globe, MapPin, Phone } from "lucide-react";
import InstagramGlyph from "@/components/icons/InstagramGlyph";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/15 bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              {/* LOGO: same file as the header — see components/Header.tsx comment. */}
              <Image
                src="/images/logo.png"
                alt="Dessi Dollhouse Aesthetics logo"
                width={40}
                height={40}
                className="rounded-full border border-gold/40"
              />
              <span className="font-serif text-base text-ink">Dessi Dollhouse Aesthetics</span>
            </div>
            <p className="mt-4 flex items-start gap-2 text-sm text-muted">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-soft" aria-hidden="true" />
              {siteConfig.location}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gold-soft">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>
                <a
                  href={siteConfig.phoneHref}
                  data-analytics-event="phone_clicked"
                  className="flex items-center gap-2 transition-colors hover:text-rose"
                >
                  <Phone size={15} aria-hidden="true" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-rose"
                >
                  <Globe size={15} aria-hidden="true" />
                  Website
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-event="instagram_clicked"
                  className="flex items-center gap-2 transition-colors hover:text-rose"
                >
                  <InstagramGlyph size={15} />
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gold-soft">
              Booking
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>
                <a
                  href={siteConfig.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-event="square_booking_clicked"
                  className="transition-colors hover:text-rose"
                >
                  View Booking Availability
                </a>
              </li>
              <li>
                <a href="#lead-form" className="transition-colors hover:text-rose">
                  Request a Consultation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gold-soft">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-rose">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-rose">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/medical-disclaimer" className="transition-colors hover:text-rose">
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="section-divider mt-12" />

        <p className="mt-6 font-serif text-sm italic text-rose-soft">
          Because confidence is your best accessory.
        </p>

        <p className="mt-4 max-w-4xl text-xs leading-relaxed text-muted">
          Information on this website is for general marketing and educational purposes and is
          not medical advice. A consultation does not guarantee treatment eligibility. All
          procedures involve potential risks. Results vary.
        </p>

        <p className="mt-4 text-xs text-muted/70">
          © {year} {siteConfig.businessName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
