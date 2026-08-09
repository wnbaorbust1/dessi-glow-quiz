"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

/**
 * Fixed bottom action bar shown only on small screens, once the visitor has
 * scrolled past the hero. Client component: it tracks scroll position.
 */
export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-gold/30 bg-bg/95 p-3 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <a
        href={siteConfig.phoneHref}
        tabIndex={visible ? 0 : -1}
        onClick={() => trackEvent("phone_clicked", { context: "sticky-mobile-cta" })}
        className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-gold/50 py-3 text-sm font-semibold text-white"
      >
        <Phone size={16} aria-hidden="true" />
        Call
      </a>
      <a
        href="#lead-form"
        tabIndex={visible ? 0 : -1}
        className="flex flex-1 items-center justify-center rounded-sm border border-rose bg-rose py-3 text-sm font-semibold text-ink"
      >
        Request a Consultation
      </a>
    </div>
  );
}
