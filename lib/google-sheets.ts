import { google } from "googleapis";
import type { LeadFormValues } from "@/lib/validation";

/**
 * Appends one validated lead to a Google Sheet using a service account.
 * Server-only — never import this from a client component.
 *
 * Setup (see README "Connect Google Sheets" for the full walkthrough):
 *   1. Create a Google Cloud service account and download its JSON key.
 *   2. Share the target spreadsheet with the service account's email
 *      (Editor access).
 *   3. Set GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, and
 *      GOOGLE_SHEETS_SPREADSHEET_ID in .env.local (see .env.example).
 *
 * If those env vars aren't set yet, this no-ops with a console warning
 * instead of throwing — so the rest of lead capture (server log, other
 * integrations) keeps working while Sheets access is still being set up.
 */
export async function appendLeadToGoogleSheet(lead: LeadFormValues): Promise<void> {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "Leads";

  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.warn(
      "[google-sheets] Skipping — GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, or " +
        "GOOGLE_SHEETS_SPREADSHEET_ID is not set. See .env.example / README."
    );
    return;
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Column order — paste this as row 1 of the sheet once, to keep it readable:
  // Submitted At | First Name | Last Name | Email | Phone | Preferred Contact |
  // Service Interest | Timeframe | Main Goal | Source | Campaign | Page URL |
  // UTM Source | UTM Medium | UTM Campaign | UTM Term | UTM Content
  const row = [
    lead.submittedAt,
    lead.firstName,
    lead.lastName,
    lead.email,
    lead.phone,
    lead.preferredContact,
    lead.serviceInterest,
    lead.timeframe,
    lead.mainGoal,
    lead.source,
    lead.campaign,
    lead.pageUrl,
    lead.utmSource,
    lead.utmMedium,
    lead.utmCampaign,
    lead.utmTerm,
    lead.utmContent,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:Q`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}
