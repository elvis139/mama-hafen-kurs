import type { Express, Request, Response } from "express";
import express from "express";
import Stripe from "stripe";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { notifyOwner } from "./_core/notification";
import { sendWelcomeEmail } from "./email";
import { courseAccess, reviewFollowUps } from "../drizzle/schema";
import { eq } from "drizzle-orm";

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(ENV.stripeSecretKey);
  }
  return stripeInstance;
}

/**
 * POST /api/stripe/create-checkout
 * Body: { email: string, origin: string, utmSource?, utmMedium?, utmCampaign? }
 * Returns: { url: string }
 */
async function handleCreateCheckout(req: Request, res: Response) {
  try {
    const { email, origin, utmSource, utmMedium, utmCampaign } = req.body as {
      email?: string;
      origin?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
    };
    const baseUrl = origin || req.headers.origin || "https://mamahafen.manus.space";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: ENV.stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: email || undefined,
      allow_promotion_codes: true,
      metadata: {
        customer_email: email || "",
        utm_source: utmSource || "",
        utm_medium: utmMedium || "",
        utm_campaign: utmCampaign || "",
      },
      success_url: `${baseUrl}/kauf/erfolg?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/kauf/abbruch`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("[Stripe] create-checkout error:", err);
    res.status(500).json({ error: "Checkout konnte nicht erstellt werden." });
  }
}

/**
 * POST /api/stripe/create-embedded-checkout
 * Body: { email: string, origin: string, utmSource?, utmMedium?, utmCampaign? }
 * Returns: { clientSecret: string }
 */
async function handleCreateEmbeddedCheckout(req: Request, res: Response) {
  try {
    const { email, origin, utmSource, utmMedium, utmCampaign } = req.body as {
      email?: string;
      origin?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
    };
    const baseUrl = origin || req.headers.origin || "https://mamahafen.manus.space";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ui_mode: "embedded_page" as any,
      line_items: [
        {
          price: ENV.stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: email || undefined,
      allow_promotion_codes: true,
      metadata: {
        customer_email: email || "",
        origin: baseUrl,
        utm_source: utmSource || "",
        utm_medium: utmMedium || "",
        utm_campaign: utmCampaign || "",
      },
      return_url: `${baseUrl}/kauf/erfolg?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("[Stripe] create-embedded-checkout error:", err);
    res.status(500).json({ error: "Checkout konnte nicht erstellt werden." });
  }
}

/**
 * POST /api/stripe/webhook
 * Stripe sends events here – must use raw body for signature verification
 */
async function handleWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      req.body as Buffer,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err) {
    console.error("[Stripe] Webhook signature verification failed:", err);
    return res.status(400).send("Webhook Error: Invalid signature");
  }

  // Test events – return verification response
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Stripe] Webhook event: ${event.type} (${event.id})`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email || session.metadata?.customer_email;
    const utmSource = session.metadata?.utm_source || null;
    const utmMedium = session.metadata?.utm_medium || null;
    const utmCampaign = session.metadata?.utm_campaign || null;

    if (email) {
      try {
        const normalizedEmail = email.toLowerCase().trim();
        const db = await getDb();
        if (!db) throw new Error("DB not available");
        // Upsert: Kurszugang für diese E-Mail aktivieren + UTM speichern
        const existing = await db
          .select()
          .from(courseAccess)
          .where(eq(courseAccess.email, normalizedEmail))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(courseAccess)
            .set({
              isActive: true,
              grantedAt: new Date(),
              utmSource: utmSource || existing[0].utmSource,
              utmMedium: utmMedium || existing[0].utmMedium,
              utmCampaign: utmCampaign || existing[0].utmCampaign,
            })
            .where(eq(courseAccess.email, normalizedEmail));
        } else {
          await db.insert(courseAccess).values({
            email: normalizedEmail,
            magicToken: null,
            tokenExpiresAt: null,
            grantedAt: new Date(),
            isActive: true,
            utmSource,
            utmMedium,
            utmCampaign,
          });
        }
        console.log(`[Stripe] Kurszugang freigeschaltet für: ${normalizedEmail} (Quelle: ${utmSource || "direkt"})`);

        // Review-Follow-up-Tracking: E-Mail für 14-Tage-Erinnerung speichern
        try {
          await db.insert(reviewFollowUps).values({
            email: normalizedEmail,
            purchasedAt: new Date(),
          }).onDuplicateKeyUpdate({ set: { purchasedAt: new Date() } });
        } catch (followUpErr) {
          console.warn("[Stripe] Review-Follow-up-Tracking fehlgeschlagen:", followUpErr);
        }

        // Willkommens-E-Mail an Käuferin senden
        const courseUrl = `${session.metadata?.origin || "https://mamahafen.manus.space"}/kurs`;
        sendWelcomeEmail(normalizedEmail, courseUrl)
          .then(() => console.log(`[Stripe] Willkommens-E-Mail gesendet an: ${normalizedEmail}`))
          .catch(e => console.warn("[Stripe] Willkommens-E-Mail fehlgeschlagen:", e));

        // Benachrichtigung an elvis@darvismedia.de senden
        const purchaseTime = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
        await notifyOwner({
          title: "🎉 Neuer Kurs-Kauf!",
          content: `Ein neuer Kauf wurde abgeschlossen:\n\n📧 E-Mail: ${normalizedEmail}\n🕐 Zeitpunkt: ${purchaseTime}\n📊 Quelle: ${utmSource || "direkt"}${utmMedium ? " / " + utmMedium : ""}${utmCampaign ? " / " + utmCampaign : ""}\n\nDer Kurszugang wurde automatisch freigeschaltet.`,
        }).catch(e => console.warn("[Stripe] Benachrichtigung fehlgeschlagen:", e));
      } catch (dbErr) {
        console.error("[Stripe] DB-Fehler beim Freischalten:", dbErr);
      }
    } else {
      console.warn("[Stripe] checkout.session.completed ohne E-Mail:", session.id);
    }
  }

  res.json({ received: true });
}

export function registerStripeRoutes(app: Express) {
  // Webhook MUSS raw body verwenden – VOR express.json() registrieren
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    handleWebhook
  );

  // Checkout-Session erstellen – braucht eigenes express.json() da es vor dem globalen registriert wird
  app.post("/api/stripe/create-checkout", express.json(), handleCreateCheckout);

  // Embedded Checkout Session erstellen
  app.post("/api/stripe/create-embedded-checkout", express.json(), handleCreateEmbeddedCheckout);
}
