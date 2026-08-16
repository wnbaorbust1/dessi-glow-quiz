# /public/images

This folder is currently **empty on purpose**. The earlier generated
placeholder images (solid color blocks) were removed because they looked
like real content on the live site. Every place they were referenced now
shows a clean "coming soon" placeholder (or, for the logo, a text wordmark)
instead — see the file list below for exactly where.

Add each file below with the real, approved asset when it's ready — keep
the same filename so no component code needs to change, **or** if you'd
rather use a different name, update the corresponding `src`/`url` in the
listed file(s).

| File               | Used in                                | Add                                                                 |
| ------------------- | --------------------------------------- | ----------------------------------------------------------------------------- |
| `logo.png`          | `components/Header.tsx`, `components/Footer.tsx`, `app/glow-quiz/layout.tsx` | The approved Dessi Dollhouse Aesthetics logo, transparent PNG, ~240x240px or larger (square). Each currently shows a text wordmark instead — swap it for a `next/image` `<Image>` once you add this file (see git history for the previous markup). |
| `hero-result.jpg`   | `components/Hero.tsx`, `app/layout.tsx` (Open Graph), `app/glow-quiz/layout.tsx` (Open Graph) | An approved studio or result photo, portrait orientation (4:5 works well) for the hero; also works as the 1200x630 social-share image. |
| `result-1.jpg`, `result-2.jpg`, `result-3.jpg` (or however many you have) | `components/ResultsGallery.tsx` | Approved, client-consented result photos. The component currently shows 3 "coming soon" cards with no click-to-expand — restore the lightbox once real photos are in (see git history). |
| `studio.jpg`        | Referenced in LocalBusiness JSON-LD (`app/page.tsx`) | An approved photo of the studio/space — add back the `image` field in `localBusinessJsonLd` once this exists. |

## Before-and-after photo requirements

- **Obtain written client consent** for every before/after photo before it is
  used on this site. Keep signed releases on file.
- Do not add captions, statistics, or claims to these images that aren't
  covered by the disclaimers already on the page (see
  `components/ResultsGallery.tsx`).
- Prefer consistent lighting/angle/crop across result photos for a cohesive
  gallery.

## Technical notes

- Images are served through `next/image`, so any reasonably sized JPG/PNG
  works — Next.js will resize and optimize automatically. Aim for source
  images at least 1200px on the long edge.
- Keep file sizes reasonable (a few MB max) for fast builds and deploys.
