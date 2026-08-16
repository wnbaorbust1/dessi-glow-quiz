"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Results", href: "#results" },
  { label: "What to Expect", href: "#what-to-expect" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "#lead-form" },
];

/**
 * Site header. Client component because it tracks scroll position (to turn
 * solid black on scroll) and toggles the mobile navigation menu.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur border-b border-rose/20 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="#top" className="flex items-center gap-3" aria-label="Dessi Dollhouse Aesthetics home">
          {/*
            LOGO: no approved logo file has been supplied yet, so this is a
            text wordmark for now. Once you have the real logo, add it to
            /public/images/logo.png and swap this <span> for a
            next/image <Image> (see git history for the previous markup).
          */}
          <span className="font-serif text-lg tracking-wide text-ink sm:text-xl">
            Dessi Dollhouse <span className="text-gold">Aesthetics</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-muted transition-colors hover:text-rose"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#lead-form"
            className="inline-flex items-center rounded-sm border border-rose bg-rose px-5 py-2.5 text-sm font-semibold tracking-wide text-ink transition-transform hover:scale-[1.02] hover:bg-rose-soft"
          >
            Request a Consultation
          </a>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-sm border border-rose/40 p-2 text-ink md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-rose/20 bg-white px-4 pb-6 pt-2 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-sm px-2 py-3 text-base text-muted transition-colors hover:text-rose"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#lead-form"
                onClick={() => setMenuOpen(false)}
                className="block rounded-sm border border-rose bg-rose px-5 py-3 text-center text-sm font-semibold tracking-wide text-ink"
              >
                Request a Consultation
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
