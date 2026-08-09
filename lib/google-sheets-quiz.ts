/**
 * Sends a quiz lead to Google Sheets via the Apps Script web app.
 * Uses the same GOOGLE_APPS_SCRIPT_URL as the consultation form.
 * No-ops if the URL is not configured.
 */
export async function sendLeadToGoogleSheets(data: {
  firstName: string;
  email: string;
  phone: string;
  dollhouseResult: string;
  serviceMatch: string;
  leadTemp: string;
  source: string;
  utmCampaign: string;
  utmSource: string;
  utmMedium: string;
  utmContent: string;
  refCode: string;
  submittedAt: string;
}): Promise<void> {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!url) {
    console.warn("[sheets-quiz] Skipping — GOOGLE_APPS_SCRIPT_URL not set.");
    return;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      submittedAt: data.submittedAt,
      firstName: data.firstName,
      lastName: "",
      email: data.email,
      phone: data.phone,
      preferredContact: "email",
      serviceInterest: data.serviceMatch,
      timeframe: data.leadTemp,
      mainGoal: `Glow Quiz Result: ${data.dollhouseResult}`,
      source: data.source,
      campaign: data.utmCampaign || "glow-quiz",
      pageUrl: "/glow-quiz",
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      utmTerm: "",
      utmContent: data.utmContent,
      refCode: data.refCode,
    }),
  });

  if (!res.ok) {
    throw new Error(`Apps Script responded ${res.status}`);
  }
}
