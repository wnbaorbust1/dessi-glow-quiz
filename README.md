# Dessi Dollhouse Aesthetics — Landing Page

A lead-generation landing page for Dessi Dollhouse Aesthetics (Liquid BBL
consultations, Austin & Pflugerville, TX), built with Next.js App Router,
TypeScript, and Tailwind CSS.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Lucide React icons
- Zod for form validation
- No external UI component library — components are hand-built in `components/`

## Installation

```bash
npm install
```

## Local development

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Where to place assets

### Logo

Replace `public/images/logo.png` with the approved brand logo (transparent
PNG, roughly square, 240×240px or larger). It's used in `components/Header.tsx`
and `components/Footer.tsx` — no code changes needed, just replace the file.

### Client / studio photos

Replace these placeholder files in `public/images/` with approved,
client-consented photos (see `public/images/README.md` for the full mapping
of file → component):

- `hero-result.jpg` — hero section image
- `result-1.jpg`, `result-2.jpg`, `result-3.jpg` — results gallery
- `studio.jpg` — referenced in LocalBusiness structured data

**Obtain written client consent for every before-and-after photo before
publishing it.** Keep signed releases on file.

## Changing contact details

All business contact info (phone, website, Instagram, booking link, location)
lives in one place: [`lib/site-config.ts`](lib/site-config.ts). Edit the
values there and every component (header, footer, hero trust panel, social
proof section, final CTA, JSON-LD) updates automatically.

## Connecting the lead form securely

The form (`components/LeadForm.tsx`) posts to `app/api/leads/route.ts`, which
**validates, console-logs, and appends each submission to Google Sheets**
(see below). Additional destinations are optional — you choose which ones
to add.

**The exact file to add further integrations to is
[`app/api/leads/route.ts`](app/api/leads/route.ts).** Inside it, look for the
`TODO: Connect any additional destinations...` comment block, which has
ready-to-adapt snippets for:

1. **Zapier webhook** — create a Zap with a "Catch Hook" trigger, put the URL
   it gives you in `ZAPIER_WEBHOOK_URL` (see `.env.example`), then `fetch()`
   it from the route handler.
2. **CRM** (HubSpot, GoHighLevel, a custom system, etc.) — set `CRM_API_URL`
   and `CRM_API_KEY` and call the CRM's contact/lead-creation endpoint.
3. **Email service** (Resend, SendGrid, Postmark, etc.) — set
   `EMAIL_SERVICE_API_KEY` and send a notification email to the team.

**Security rules to keep:**

- All secrets (`GOOGLE_SHEETS_PRIVATE_KEY`, `ZAPIER_WEBHOOK_URL`,
  `CRM_API_KEY`, etc.) must be read from `process.env` inside the
  **server-only** route handler (`app/api/leads/route.ts`) or its helpers
  (`lib/google-sheets.ts`), never in a component marked `"use client"`.
- Never prefix a secret with `NEXT_PUBLIC_` — that prefix tells Next.js to
  bundle the value into client-side JavaScript, exposing it to anyone who
  views page source.
- Copy `.env.example` to `.env.local` and fill in real values there;
  `.env.local` is already git-ignored.

## Connecting Google Sheets (Apps Script) — recommended

This is the **active integration**. Every valid, non-spam submission is
appended as a new row via [`lib/apps-script-sheets.ts`](lib/apps-script-sheets.ts),
called from `app/api/leads/route.ts`. It uses a small script attached
directly to the destination Google Sheet — no Google Cloud project, no
service account, no key file. This also sidesteps the "Service account key
creation is disabled" error that some Google Workspace/Cloud organizations
enforce (see the direct-API alternative below if that doesn't apply to you
and you'd rather avoid Apps Script).

1. **Open the destination Google Sheet** (create one if you don't have it
   yet) at [sheets.google.com](https://sheets.google.com).
2. **Extensions → Apps Script.** This opens a code editor already attached
   to that sheet.
3. Delete the placeholder `function myFunction() {}` code and paste in:

   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);
     sheet.appendRow([
       data.submittedAt, data.firstName, data.lastName, data.email, data.phone,
       data.preferredContact, data.serviceInterest, data.timeframe, data.mainGoal,
       data.source, data.campaign, data.pageUrl,
       data.utmSource, data.utmMedium, data.utmCampaign, data.utmTerm, data.utmContent
     ]);
     return ContentService.createTextOutput(JSON.stringify({ok: true}))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
4. Save (⌘S), naming the project if asked (e.g. "Dessi Leads Receiver").
5. **Deploy → New deployment** → click the gear icon next to "Select type"
   → **Web app**.
6. Set **"Execute as"** to **Me**, and **"Who has access"** to **Anyone** →
   **Deploy**.
7. Authorize it when prompted (it's your own script, on your own sheet —
   click through the "unverified app" warning via **Advanced → Go to
   [project name] (unsafe) → Allow**).
8. Copy the **Web app URL** it gives you (`https://script.google.com/macros/s/.../exec`)
   into `.env.local` as `GOOGLE_APPS_SCRIPT_URL` (see `.env.example`).
9. Restart `npm run dev` (or redeploy) so the new env var is picked up.

If you ever edit the script itself, you'll need to **Deploy → Manage
deployments → edit (pencil icon) → New version → Deploy** for the change to
take effect — saving alone doesn't update a live deployment.

## Connecting Google Sheets (direct API) — alternative

If your Google account isn't restricted by an org policy and you'd rather
avoid Apps Script, [`lib/google-sheets.ts`](lib/google-sheets.ts) implements
the same thing via a Google Cloud service account. It's wired into
`app/api/leads/route.ts` alongside the Apps Script integration and no-ops
harmlessly until configured, so both can coexist.

1. **Create a Google Cloud project** (or reuse one) at
   [console.cloud.google.com](https://console.cloud.google.com).
2. **Enable the Google Sheets API** for that project (APIs & Services →
   Enable APIs and Services → search "Google Sheets API" → Enable).
3. **Create a service account** (APIs & Services → Credentials → Create
   Credentials → Service account). Give it any name; no project role is
   needed.
4. **Create a JSON key** for that service account (its page → Keys → Add Key
   → Create new key → JSON) and download it. If you see "Service account
   key creation is disabled," your organization has blocked this — use the
   Apps Script method above instead.
5. **Create (or open) the destination Google Sheet**, and share it with the
   service account's email address (found in the JSON key as `client_email`,
   looks like `name@project-id.iam.gserviceaccount.com`) — give it **Editor**
   access, same as sharing with a person.
6. **Copy three values into `.env.local`** (see `.env.example`):
   - `GOOGLE_SHEETS_CLIENT_EMAIL` — the JSON key's `client_email`.
   - `GOOGLE_SHEETS_PRIVATE_KEY` — the JSON key's `private_key`, pasted in
     quotes with its `\n` line breaks kept literal, e.g.
     `GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"`.
   - `GOOGLE_SHEETS_SPREADSHEET_ID` — from the sheet's URL:
     `docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`.
7. **(Optional)** paste this as row 1 of the sheet so the columns are
   labeled — `lib/google-sheets.ts` writes columns in this exact order:
   `Submitted At | First Name | Last Name | Email | Phone | Preferred Contact | Service Interest | Timeframe | Main Goal | Source | Campaign | Page URL | UTM Source | UTM Medium | UTM Campaign | UTM Term | UTM Content`
8. Restart `npm run dev` (or redeploy) so the new env vars are picked up.

By default it writes to a sheet/tab named **"Leads"** — set
`GOOGLE_SHEETS_SHEET_NAME` if yours is named differently.

## Connecting Square booking

The Square booking link is set once in `lib/site-config.ts`
(`siteConfig.bookingUrl`) and used by the form's success screen, the footer,
and the social proof section. To change it, update that one value — no
Square API integration is required for this page, since it links out to your
existing Square booking page.

## Deploying to Vercel

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. In Vercel, "Add New Project" → import the repository.
3. Add your environment variables (from `.env.example`) in the Vercel project
   settings under **Environment Variables**.
4. Deploy. Vercel auto-detects Next.js — no extra config needed.

```bash
# Or, from the CLI:
npx vercel
```

## Setting the canonical domain

Once you know the production domain:

1. Update `canonicalUrl` in [`lib/site-config.ts`](lib/site-config.ts).
2. That value feeds `metadataBase`, the canonical `<link>` tag, and Open
   Graph/Twitter URLs in [`app/layout.tsx`](app/layout.tsx), plus the
   LocalBusiness/Service JSON-LD in [`app/page.tsx`](app/page.tsx).
3. Optionally also set `NEXT_PUBLIC_SITE_URL` in your environment for
   parity if you extend the analytics/SEO setup later.

## Adding analytics

`lib/analytics.ts` exports a single `trackEvent()` helper already wired into
the key user actions:

- `consultation_form_started`
- `consultation_form_submitted`
- `square_booking_clicked`
- `phone_clicked`
- `instagram_clicked`
- `results_viewed`

No real tracking IDs are included. To connect a provider:

- **Google Analytics (GA4):** add the `gtag.js` snippet to
  `app/layout.tsx` (or use `@next/third-parties`), set
  `NEXT_PUBLIC_GA_MEASUREMENT_ID`, then uncomment the `window.gtag?.(...)`
  line in `lib/analytics.ts`.
- **Meta Pixel:** add the Pixel base snippet to `app/layout.tsx`, set
  `NEXT_PUBLIC_META_PIXEL_ID`, then uncomment the `window.fbq?.(...)` line in
  `lib/analytics.ts`.

Phone, Instagram, and Square-booking links that live in server components
(footer, social proof, final CTA) are tracked via
`components/AnalyticsListener.tsx`, a single small client component that
listens for clicks on any element with a `data-analytics-event` attribute —
this avoids turning every section that contains a link into a client
component.

## Important reminders before launch

- **Before-and-after photos:** obtain written client consent for every photo
  used in the results gallery, hero section, or anywhere else on the site.
- **Medical and advertising claims:** every claim on this site — in the
  hero, service overview, FAQ, "why choose us" section, and especially the
  `/privacy`, `/terms`, and `/medical-disclaimer` placeholder pages — must be
  reviewed and approved by the licensed provider and a legal/compliance
  advisor before this site goes live. No prices, credentials, certifications,
  guarantees, or statistics have been invented here; placeholders are marked
  clearly in code comments and on the legal pages themselves.

## Scripts

```bash
npm run dev      # start the local dev server
npm run lint      # run ESLint
npm run build     # production build (also type-checks)
npm run start     # run the production build locally
```

## Project structure

```
app/
  layout.tsx                 Root layout, fonts, global <head> metadata
  page.tsx                   Landing page composition + JSON-LD
  globals.css                Design tokens (colors, fonts) + Tailwind import
  api/leads/route.ts         Lead form POST handler (see above)
  privacy/page.tsx            Placeholder legal page
  terms/page.tsx              Placeholder legal page
  medical-disclaimer/page.tsx Placeholder legal page
components/                  One component per page section
lib/
  site-config.ts              Business name/contact/links (single source of truth)
  validation.ts                Zod schema + phone formatting, shared client/server
  analytics.ts                 trackEvent() helper, no real IDs wired in
public/images/                Placeholder images — see public/images/README.md
```
