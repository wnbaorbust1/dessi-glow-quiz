# /public/images

This folder currently contains **generated placeholder images only** (solid
color blocks). Replace each file below with the real, approved asset before
launch — keep the same filename so no component code needs to change.

| File               | Used in                                | Replace with                                                                 |
| ------------------- | --------------------------------------- | ----------------------------------------------------------------------------- |
| `logo.png`          | `components/Header.tsx`, `components/Footer.tsx` | The approved Dessi Dollhouse Aesthetics logo, transparent PNG, ~240x240px or larger (square). |
| `hero-result.jpg`   | `components/Hero.tsx`, Open Graph image | An approved studio or result photo, portrait orientation (4:5 works well). |
| `result-1.jpg`      | `components/ResultsGallery.tsx`         | An approved, client-consented result photo.                                  |
| `result-2.jpg`      | `components/ResultsGallery.tsx`         | An approved, client-consented result photo.                                  |
| `result-3.jpg`      | `components/ResultsGallery.tsx`         | An approved, client-consented result photo.                                  |
| `studio.jpg`        | Referenced in LocalBusiness JSON-LD (`app/page.tsx`) | An approved photo of the studio/space.                                       |

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
