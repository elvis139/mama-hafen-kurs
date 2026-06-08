/**
 * 14-Tage-Follow-up-E-Mail für Bewertungsanfragen.
 * Wird täglich von einem Heartbeat-Cron aufgerufen.
 * Route: POST /api/scheduled/review-followup
 */

import type { Express, Request, Response } from "express";
import { getDb } from "./db";
import { reviewFollowUps } from "../drizzle/schema";
import { isNull, lte, and } from "drizzle-orm";
import { sendEmail } from "./email";

const REVIEW_URL = "https://mamahafen.manus.space/bewertung";
const FROM_NAME = "Mamaleen – Mama-Hafen";

function buildFollowUpEmail(reviewUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Wie läuft es bei euch?</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background:#2a7c6f;border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:28px;">⚓</p>
              <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;color:#ffffff;font-weight:700;">
                Mama-Hafen
              </h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:0.08em;text-transform:uppercase;">
                Gelassen durch die Autonomiephase
              </p>
            </td>
          </tr>

          <!-- MAIN CARD -->
          <tr>
            <td style="background:#ffffff;padding:44px 40px 36px;">

              <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:24px;color:#1a2e2a;line-height:1.3;">
                Wie läuft es bei euch? 🌿
              </h2>

              <p style="margin:0 0 20px;font-size:16px;color:#4a5568;line-height:1.7;">
                Es sind jetzt zwei Wochen vergangen, seit du den Mama-Hafen-Kurs gestartet hast. 
                Ich hoffe, du konntest schon erste Veränderungen bemerken – auch kleine Schritte zählen!
              </p>

              <p style="margin:0 0 20px;font-size:16px;color:#4a5568;line-height:1.7;">
                Ich hätte eine kleine Bitte an dich: <strong style="color:#1a2e2a;">Würdest du 2 Minuten 
                nehmen und mir erzählen, wie es dir mit dem Kurs geht?</strong>
              </p>

              <!-- QUOTE BOX -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#f0f9f7;border-left:4px solid #2a7c6f;border-radius:0 8px 8px 0;padding:18px 20px;">
                    <p style="margin:0;font-size:15px;color:#2a7c6f;line-height:1.6;">
                      Dein Feedback hilft anderen Mamas, die gerade in der gleichen Situation sind – 
                      und es hilft mir, den Kurs noch besser zu machen.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:15px;color:#4a5568;line-height:1.7;">
                Das Formular dauert wirklich nur 2 Minuten:
              </p>

              <!-- FEATURE LIST -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr><td style="padding:4px 0;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:24px;font-size:15px;">⭐</td>
                    <td style="font-size:14px;color:#4a5568;line-height:1.6;padding-left:8px;">Sternebewertung</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:4px 0;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:24px;font-size:15px;">💬</td>
                    <td style="font-size:14px;color:#4a5568;line-height:1.6;padding-left:8px;">Kurze Beschreibung: Vorher / Nachher</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:4px 0;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:24px;font-size:15px;">🔒</td>
                    <td style="font-size:14px;color:#4a5568;line-height:1.6;padding-left:8px;">Nur mit deiner Erlaubnis wird es veröffentlicht</td>
                  </tr></table>
                </td></tr>
              </table>

              <!-- CTA BUTTON -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td align="center">
                    <a href="${reviewUrl}"
                       style="display:inline-block;background:#e07a5f;color:#ffffff;font-size:17px;font-weight:700;
                              text-decoration:none;padding:16px 40px;border-radius:50px;
                              letter-spacing:0.02em;box-shadow:0 4px 16px rgba(224,122,95,0.35);">
                      Jetzt Feedback geben →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;color:#a0aec0;text-align:center;line-height:1.6;">
                Herzlichen Dank – ich freue mich riesig über jede Rückmeldung! 🌿<br/>
                Bei Fragen erreichst du mich unter 
                <a href="mailto:info@darvismedia.de" style="color:#2a7c6f;text-decoration:none;">info@darvismedia.de</a>
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#2a7c6f;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7);line-height:1.6;">
                Mama-Hafen · Ein Kurs von Mamaleen<br/>
                <a href="https://mamahafen.manus.space" style="color:rgba(255,255,255,0.9);text-decoration:none;">
                  mamahafen.manus.space
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Handler für den täglichen Heartbeat-Cron.
 * Sendet Follow-up-E-Mails an Käuferinnen, die vor 14+ Tagen gekauft haben
 * und noch keine Bewertungsanfrage erhalten haben.
 */
async function handleReviewFollowUp(_req: Request, res: Response) {
  const startTime = Date.now();
  const results: { email: string; status: "sent" | "error"; error?: string }[] = [];

  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "DB nicht verfügbar" });
    }

    // Alle Einträge holen, die vor 14+ Tagen gekauft haben und noch keine E-Mail bekommen haben
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const pending = await db
      .select()
      .from(reviewFollowUps)
      .where(
        and(
          isNull(reviewFollowUps.followUpSentAt),
          lte(reviewFollowUps.purchasedAt, fourteenDaysAgo)
        )
      );

    console.log(`[ReviewFollowUp] ${pending.length} E-Mails zu senden`);

    for (const entry of pending) {
      try {
        await sendEmail({
          to: entry.email,
          subject: "Wie läuft es bei euch? 🌿 – Dein Mama-Hafen-Feedback",
          html: buildFollowUpEmail(REVIEW_URL),
          text: `Hallo!\n\nEs sind jetzt zwei Wochen vergangen, seit du den Mama-Hafen-Kurs gestartet hast.\n\nIch würde mich sehr freuen, wenn du kurz dein Feedback teilst:\n${REVIEW_URL}\n\nDas dauert nur 2 Minuten!\n\nHerzliche Grüße,\nDarleen (Mamaleen)\n\nBei Fragen: info@darvismedia.de`,
        });

        // Als gesendet markieren
        const { eq } = await import("drizzle-orm");
        await db
          .update(reviewFollowUps)
          .set({ followUpSentAt: new Date() })
          .where(eq(reviewFollowUps.id, entry.id));

        results.push({ email: entry.email, status: "sent" });
        console.log(`[ReviewFollowUp] E-Mail gesendet an: ${entry.email}`);
      } catch (emailErr) {
        const errMsg = emailErr instanceof Error ? emailErr.message : String(emailErr);
        results.push({ email: entry.email, status: "error", error: errMsg });
        console.error(`[ReviewFollowUp] Fehler bei ${entry.email}:`, emailErr);
      }
    }

    const duration = Date.now() - startTime;
    return res.json({
      ok: true,
      processed: pending.length,
      sent: results.filter(r => r.status === "sent").length,
      errors: results.filter(r => r.status === "error").length,
      duration,
      results,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[ReviewFollowUp] Kritischer Fehler:", err);
    return res.status(500).json({
      error: errMsg,
      timestamp: new Date().toISOString(),
    });
  }
}

export function registerReviewFollowUpRoute(app: Express) {
  app.post("/api/scheduled/review-followup", handleReviewFollowUp);
}
