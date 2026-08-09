"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

/**
 * Mounts a single document-level click listener so that plain server-rendered
 * links (phone, Instagram, Square booking) can still be tracked, without
 * turning every section that contains them into a client component.
 *
 * Usage: add `data-analytics-event="phone_clicked"` (etc) to any <a>.
 */
export default function AnalyticsListener() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>("[data-analytics-event]");
      if (!trigger) return;

      const eventName = trigger.dataset.analyticsEvent as AnalyticsEventName | undefined;
      if (!eventName) return;

      trackEvent(eventName, {
        href: trigger.getAttribute("href") ?? undefined,
      });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
