/**
 * Lightweight analytics utility.
 *
 * This intentionally has ZERO real tracking IDs wired up. It logs events to
 * the console in development so the event contract can be verified, and
 * gives you a single place to wire up real analytics later.
 *
 * TO CONNECT GOOGLE ANALYTICS (GA4):
 *   1. Add the gtag.js snippet to app/layout.tsx (or use `@next/third-parties`).
 *   2. Set NEXT_PUBLIC_GA_MEASUREMENT_ID in your environment.
 *   3. Inside trackEvent() below, call:
 *        window.gtag?.("event", eventName, payload);
 *
 * TO CONNECT META PIXEL:
 *   1. Add the Meta Pixel base snippet to app/layout.tsx.
 *   2. Set NEXT_PUBLIC_META_PIXEL_ID in your environment.
 *   3. Inside trackEvent() below, call:
 *        window.fbq?.("trackCustom", eventName, payload);
 */

export type AnalyticsEventName =
  | "consultation_form_started"
  | "consultation_form_submitted"
  | "square_booking_clicked"
  | "phone_clicked"
  | "instagram_clicked"
  | "results_viewed";

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(eventName: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV !== "production") {
    console.log(`[analytics] ${eventName}`, payload);
  }

  // --- Google Analytics 4 (uncomment once gtag.js is installed) ---
  // window.gtag?.("event", eventName, payload);

  // --- Meta Pixel (uncomment once the Pixel base code is installed) ---
  // window.fbq?.("trackCustom", eventName, payload);
}
