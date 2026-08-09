import type { LeadFormValues } from "@/lib/validation";

/**
 * Sends one validated lead to a Zapier "Catch Hook" webhook. Server-only —
 * never import this from a client component, and never expose the webhook
 * URL itself to the client.
 *
 * Set ZAPIER_WEBHOOK_URL in .env.local (see .env.example). From there, wire
 * the Zap's action(s) to whatever you want — Google Sheets, email, a CRM,
 * SMS, etc. No-ops with a console warning if the env var isn't set, so lead
 * capture (server log, other integrations) keeps working either way.
 */
export async function sendLeadToZapier(lead: LeadFormValues): Promise<void> {
  const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("[zapier] Skipping — ZAPIER_WEBHOOK_URL is not set. See .env.example.");
    return;
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });

  if (!res.ok) {
    throw new Error(`Zapier webhook responded with ${res.status}`);
  }
}
