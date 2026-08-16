"use client";

// Client component: tracks whether this section was viewed, for analytics.
// (The click-to-expand lightbox will come back once real photos are in —
// see the comment below — at which point this will need useState/useRef
// again for the open/closed image and keyboard handling.)

import { useRef } from "react";
import { Camera } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// RESULT PHOTOS: no approved, client-consented before/after photos have
// been supplied yet, so this section shows placeholders instead of fake
// photos. Once you have real photos:
//   1. Add them to /public/images/result-1.jpg, result-2.jpg, result-3.jpg
//      (or however many you have).
//   2. Replace the placeholder cards below with next/image <Image fill .../>
//      cards, and restore the click-to-expand lightbox (see git history for
//      the previous markup, which had both).
//   3. Write real alt text describing each photo without making outcome
//      claims (no "amazing", "dramatic", guaranteed-result language, etc).
const PLACEHOLDER_COUNT = 3;

export default function ResultsGallery() {
  const hasTrackedView = useRef(false);

  function handleSectionInView() {
    if (!hasTrackedView.current) {
      hasTrackedView.current = true;
      trackEvent("results_viewed");
    }
  }

  return (
    <section id="results" className="bg-cream" onMouseEnter={handleSectionInView}>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">Real Client Results</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-warm sm:text-base">
            Explore examples of work performed by Dessi Dollhouse Aesthetics. Individual outcomes
            vary.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
            <div
              key={index}
              className="gold-border relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-md border-dashed bg-cream-surface text-center"
            >
              <Camera size={28} className="text-rose/50" aria-hidden="true" />
              <p className="max-w-[70%] text-sm text-muted-warm">Client photo coming soon</p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-warm">
          Photos are shown with client permission. Results vary by individual. Images may reflect
          temporary swelling or immediate post-treatment appearance.
        </p>
      </div>
    </section>
  );
}
