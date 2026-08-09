/**
 * Email utility — powered by Resend.
 * No-ops gracefully when RESEND_API_KEY is not set.
 *
 * To enable: set RESEND_API_KEY in .env.local
 * and set EMAIL_FROM_ADDRESS to a verified Resend sender.
 */
import { Resend } from "resend";
import { siteConfig } from "./site-config";
import type { QuizResult, LeadTemperature } from "./quiz-types";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM_ADDRESS ?? "noreply@dessidollhouse.com";
const TEAM_EMAIL = process.env.LEADS_NOTIFICATION_EMAIL ?? "";

interface QuizLeadEmailData {
  firstName: string;
  email: string;
  result: QuizResult;
  leadTemp: LeadTemperature;
}

/** Send the Day 0 "Your Dollhouse Match Is Here" email to the quiz taker */
export async function sendQuizResultEmail(data: QuizLeadEmailData): Promise<void> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping quiz result email");
    return;
  }

  const { firstName, email, result } = data;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Dollhouse Match Is Here 💕</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,serif;color:#f3e3d5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a0a;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="background:#141414;border:1px solid rgba(198,160,107,0.3);border-radius:8px;max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 0;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c6a06b;">
                Desi Dollhouse · Pflugerville, Texas
              </p>
              <h1 style="margin:16px 0 0;font-size:28px;font-weight:700;color:#f3e3d5;line-height:1.2;">
                Your Dollhouse Match Is Here 💕
              </h1>
            </td>
          </tr>

          <!-- Result -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:#c17e6c;">
                Hi ${firstName} — you&apos;re a...
              </p>
              <h2 style="margin:0 0 4px;font-size:32px;font-weight:700;color:#f3e3d5;">
                ${result.emoji} ${result.dollName}
              </h2>
              <p style="margin:8px 0 0;font-size:14px;color:#c6a06b;letter-spacing:0.1em;text-transform:uppercase;">
                Your Potential Match: ${result.serviceMatch}
              </p>

              <div style="margin:24px 0;padding:24px;background:rgba(198,160,107,0.08);border-left:3px solid #c6a06b;border-radius:4px;">
                <p style="margin:0;font-size:15px;line-height:1.7;color:#f3e3d5;font-style:italic;">
                  &ldquo;${result.tagline}&rdquo;
                </p>
              </div>

              <p style="margin:0;font-size:14px;line-height:1.8;color:#c9c9c9;">
                ${result.description}
              </p>

              <p style="margin:20px 0 0;font-size:13px;line-height:1.7;color:#8a7a6e;">
                ${result.whyYouMatched}
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <a href="${siteConfig.bookingUrl}"
                style="display:inline-block;background:#c17e6c;color:#211a15;font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:14px 36px;border-radius:3px;">
                Book My Consultation
              </a>
              <p style="margin:16px 0 0;font-size:12px;color:#8a7a6e;">
                Or call us at <a href="${siteConfig.phoneHref}" style="color:#c6a06b;">${siteConfig.phone}</a>
              </p>
            </td>
          </tr>

          <!-- Disclaimer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(198,160,107,0.15);">
              <p style="margin:0;font-size:11px;line-height:1.7;color:#8a7a6e;">
                <strong style="color:#c9c9c9;">Disclaimer:</strong> This quiz result is for
                educational and promotional purposes only. It does not constitute medical advice,
                a diagnosis, or a determination of treatment eligibility. Results vary. A consultation
                with a qualified provider is required before any treatment decision. Desi Dollhouse
                is located in Pflugerville, Texas.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#8a7a6e;">
                © ${new Date().getFullYear()} Desi Dollhouse · Pflugerville, TX<br/>
                You received this email because you completed the Dollhouse Glow Quiz.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Your Dollhouse Match Is Here 💕 — ${result.dollName}`,
      html,
    });
  } catch (err) {
    console.error("[email] Failed to send quiz result email:", err);
  }
}

/** Notify the Desi Dollhouse team of a new quiz lead */
export async function sendTeamNotification(data: {
  firstName: string;
  email: string;
  phone?: string;
  result: QuizResult;
  leadTemp: LeadTemperature;
  refCode?: string;
}): Promise<void> {
  if (!resend || !TEAM_EMAIL) return;

  const { firstName, email, phone, result, leadTemp, refCode } = data;
  const tempLabels: Record<LeadTemperature, string> = {
    hot: "🔥 HOT — Ready Now",
    warm: "☀️ Warm — Within 30 days",
    nurture: "🌱 Nurture — 1-3 months",
    education: "📚 Education — Just researching",
  };

  try {
    await resend.emails.send({
      from: FROM,
      to: TEAM_EMAIL,
      subject: `New Quiz Lead: ${firstName} — ${result.serviceMatch} (${leadTemp})`,
      html: `<p><strong>Name:</strong> ${firstName}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone ?? "not provided"}</p>
<p><strong>Dollhouse Match:</strong> ${result.dollName} — ${result.serviceMatch}</p>
<p><strong>Lead Temp:</strong> ${tempLabels[leadTemp]}</p>
${refCode ? `<p><strong>Ambassador Code:</strong> ${refCode}</p>` : ""}
<p><a href="${siteConfig.bookingUrl}">Square Booking</a></p>`,
    });
  } catch (err) {
    console.error("[email] Failed to send team notification:", err);
  }
}
