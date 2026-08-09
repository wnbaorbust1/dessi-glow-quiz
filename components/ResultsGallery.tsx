"use client";

// Client component: the click-to-expand lightbox requires interactive state
// (open/closed image, keyboard handling) that a server component can't provide.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type GalleryImage = {
  src: string;
  before: string;
  after: string;
  alt: string;
};

// RESULT PHOTOS: replace the src values below with approved, client-consented
// before/after photos placed in /public/images. Update the alt text to
// describe what's shown without making outcome claims (no "amazing",
// "dramatic", guaranteed-result language, etc).
const IMAGES: GalleryImage[] = [
  {
    src: "/images/result-1.jpg",
    before: "Before",
    after: "After",
    alt: "Client result photo 1 from Dessi Dollhouse Aesthetics, shown with client permission",
  },
  {
    src: "/images/result-2.jpg",
    before: "Before",
    after: "After",
    alt: "Client result photo 2 from Dessi Dollhouse Aesthetics, shown with client permission",
  },
  {
    src: "/images/result-3.jpg",
    before: "Before",
    after: "After",
    alt: "Client result photo 3 from Dessi Dollhouse Aesthetics, shown with client permission",
  },
];

export default function ResultsGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (activeIndex === null) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  function handleSectionInView() {
    if (!hasTrackedView.current) {
      hasTrackedView.current = true;
      trackEvent("results_viewed");
    }
  }

  const active = activeIndex !== null ? IMAGES[activeIndex] : null;

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
          {IMAGES.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="gold-border group relative aspect-[4/5] w-full overflow-hidden rounded-md bg-cream-surface text-left transition-transform hover:scale-[1.01]"
              aria-label={`Expand ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-opacity group-hover:opacity-90"
              />
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/90 to-transparent px-4 pb-3 pt-8 text-xs font-semibold tracking-wide text-white">
                <span>{image.before}</span>
                <span className="text-rose-soft">{image.after}</span>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-warm">
          Photos are shown with client permission. Results vary by individual. Images may reflect
          temporary swelling or immediate post-treatment appearance.
        </p>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/95 p-4"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="gold-border relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-md bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-3 top-3 z-10 rounded-full border border-gold/40 bg-bg/80 p-2 text-white hover:text-gold-soft"
              aria-label="Close image"
            >
              <X size={20} />
            </button>
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="(min-width: 640px) 640px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
