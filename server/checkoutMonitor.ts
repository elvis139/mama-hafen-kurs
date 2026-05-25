import type { Express, Request, Response } from "express";
import { sendEmail } from "./email";
import { getDb } from "./db";
import { checkoutTestLogs } from "../drizzle/schema";
import { desc, asc } from "drizzle-orm";

const OWNER_EMAIL = "elvis@darvismedia.de";
const CHECKOUT_URL = "https://mamahafen-dswbdqtv.manus.space/api/stripe/create-checkout";
const MAX_LOGS = 10;

/**
 * Speichert einen Test-Log-Eintrag in der DB.
 * Hält die Tabelle auf maximal MAX_LOGS Einträge (je für success und error).
 */
async function saveLog(status: "success" | "error", message: string, errorCode?: string, responseTime?: number) {
  const db = await getDb();
  if (!db) return;

  // Eintrag speichern
  await db.insert(checkoutTestLogs).values({
    status,
    message,
    errorCode: errorCode ?? null,
    responseTime: responseTime ?? null,
  });

  // Nur die letzten MAX_LOGS Einträge behalten (getrennt nach status)
  const allLogs = await db
    .select({ id: checkoutTestLogs.id })
    .from(checkoutTestLogs)
    .orderBy(desc(checkoutTestLogs.testedAt));

  if (allLogs.length > MAX_LOGS) {
    const toDelete = allLogs.slice(MAX_LOGS);
    for (const log of toDelete) {
      await db.delete(checkoutTestLogs).where(
        // @ts-ignore
        (t: typeof checkoutTestLogs) => t.id.eq(log.id)
      );
    }
  }
}

/**
 * Testet ob der Stripe-Checkout erreichbar und funktionsfähig ist.
 * Wird alle 60 Minuten vom Heartbeat-Cron aufgerufen.
 * Bei Fehler wird eine E-Mail an den Owner gesendet.
 */
async function handleCheckoutMonitor(req: Request, res: Response) {
  const timestamp = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    let checkoutOk = false;
    let errorDetail = "";
    let errorCode = "";

    try {
      const response = await fetch(CHECKOUT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "monitor@mamahafen.test",
          origin: "https://mamahafen.manus.space",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const responseTime = Date.now() - startTime;
      const data = await response.json() as { url?: string; error?: string };

      if (response.ok && data.url && data.url.startsWith("https://checkout.stripe.com")) {
        checkoutOk = true;
        await saveLog("success", `Checkout OK – Antwortzeit: ${responseTime}ms`, undefined, responseTime);
      } else {
        errorCode = `HTTP_${response.status}`;
        errorDetail = `HTTP ${response.status} – Antwort: ${JSON.stringify(data)}`;
        await saveLog("error", errorDetail, errorCode, responseTime);
      }
    } catch (fetchErr: unknown) {
      clearTimeout(timeout);
      const responseTime = Date.now() - startTime;
      const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      errorCode = fetchErr instanceof Error && fetchErr.name === "AbortError" ? "TIMEOUT" : "NETWORK_ERROR";
      errorDetail = `Netzwerkfehler: ${msg}`;
      await saveLog("error", errorDetail, errorCode, responseTime);
    }

    if (!checkoutOk) {
      await sendEmail({
        to: OWNER_EMAIL,
        subject: "⚠️ Mama-Hafen: Checkout funktioniert nicht!",
        html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:#c0392b;padding:28px 40px;text-align:center;">
              <h1 style="margin:0;font-size:22px;color:#fff;font-weight:700;">⚠️ Checkout-Fehler erkannt</h1>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">Automatischer Monitor – Mama-Hafen</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <p style="font-size:16px;color:#2d3748;line-height:1.7;margin:0 0 16px;">
                Der automatische Checkout-Monitor hat um <strong>${timestamp}</strong> einen Fehler festgestellt.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background:#fff5f5;border-left:4px solid #c0392b;border-radius:0 8px 8px 0;padding:16px 20px;">
                    <p style="margin:0 0 8px;font-size:12px;color:#718096;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Fehlercode</p>
                    <p style="margin:0 0 12px;font-size:14px;color:#c0392b;font-family:monospace;font-weight:700;">${errorCode}</p>
                    <p style="margin:0;font-size:14px;color:#c0392b;font-family:monospace;word-break:break-all;">${errorDetail}</p>
                  </td>
                </tr>
              </table>
              <p style="font-size:15px;color:#4a5568;line-height:1.7;margin:0 0 20px;">
                <strong>Was das bedeutet:</strong> Neue Käufe auf mamahafen.manus.space sind möglicherweise nicht möglich. Bitte sofort prüfen!
              </p>
              <p style="font-size:14px;color:#718096;margin:0;">
                Mögliche Ursachen:<br/>
                • Stripe API-Key abgelaufen oder ungültig<br/>
                • Stripe Price-ID nicht mehr aktiv<br/>
                • Server-Fehler oder Ausfall
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#2a7c6f;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7);">
                Mama-Hafen Checkout-Monitor · Automatische Benachrichtigung
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
        text: `Checkout-Fehler um ${timestamp}!\n\nFehlercode: ${errorCode}\nDetail: ${errorDetail}\n\nBitte sofort prüfen: https://mamahafen.manus.space`,
      });

      console.error(`[CheckoutMonitor] Fehler um ${timestamp} [${errorCode}]: ${errorDetail} – E-Mail gesendet.`);
      return res.json({ ok: false, error: errorDetail, errorCode, emailSent: true, timestamp });
    }

    console.log(`[CheckoutMonitor] OK um ${timestamp} – Checkout funktioniert.`);
    return res.json({ ok: true, timestamp });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[CheckoutMonitor] Unerwarteter Fehler: ${msg}`);
    await saveLog("error", `Unerwarteter Fehler: ${msg}`, "UNEXPECTED_ERROR");
    return res.status(500).json({
      error: msg,
      context: { url: CHECKOUT_URL, timestamp },
      timestamp,
    });
  }
}

export function registerCheckoutMonitorRoute(app: Express) {
  app.post("/api/scheduled/checkout-monitor", handleCheckoutMonitor);
}
