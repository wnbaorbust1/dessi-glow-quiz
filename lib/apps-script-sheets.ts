import type { LeadFormValues } from "@/lib/validation";

/**
 * Sends one validated lead to a Google Apps Script "Web app" deployment
 * that appends a row to a Google Sheet — see README "Connect Google Sheets
 * (Apps Script)" for the full walkthrough. This is the recommended path
 * when your Google account's organization policy blocks service-account
 * key creation (see lib/google-sheets.ts), since Apps Script runs under
 * your own account with no key file involved.
 *
 * Set GOOGLE_APPS_SCRIPT_URL in .env.local (see .env.example). No-ops with
 * a console warning if unset, so lead capture keeps working either way.
 */
export async function sendLeadToAppsScriptSheet(lead: LeadFormValues): Promise<void> {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!url) {
    console.warn("[apps-script] Skipping — GOOGLE_APPS_SCRIPT_URL is not set. See .env.example.");
    return;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });

  if (!res.ok) {
    throw new Error(`Apps Script web app responded with ${res.status}`);
  }
}
