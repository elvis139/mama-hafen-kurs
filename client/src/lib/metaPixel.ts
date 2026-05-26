/**
 * Meta Pixel Helper
 * Pixel ID: 1464149581564441
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const PIXEL_IDS = ["1464149581564441"];

function hasConsent(): boolean {
  try {
    return localStorage.getItem("mama_hafen_cookie_consent") === "accepted";
  } catch {
    return false;
  }
}

function fbq(event: string, eventName: string, params?: Record<string, unknown>) {
  if (!hasConsent()) return;
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    PIXEL_IDS.forEach((id) => {
      window.fbq!(event, eventName, params, { eventID: id });
    });
  }
}

/** Wird automatisch beim Seitenwechsel gefeuert (PageView ist bereits im HTML-Head) */
export function trackPageView() {
  fbq("track", "PageView");
}

/** Kauf-Button geklickt – Nutzer beginnt den Checkout-Prozess */
export function trackInitiateCheckout(value?: number) {
  fbq("track", "InitiateCheckout", {
    content_name: "Mama-Hafen Online-Kurs",
    content_category: "Online-Kurs",
    currency: "EUR",
    value: value ?? 97,
    num_items: 1,
  });
}

/** Kauf erfolgreich abgeschlossen (nach Stripe-Weiterleitung) */
export function trackPurchase(value?: number) {
  fbq("track", "Purchase", {
    content_name: "Mama-Hafen Online-Kurs",
    content_category: "Online-Kurs",
    currency: "EUR",
    value: value ?? 97,
    content_type: "product",
    content_ids: ["mama-hafen-kurs"],
    num_items: 1,
  });
}

/** Kursseite aufgerufen (Nutzer hat Zugang und sieht den Kurs) */
export function trackViewContent() {
  fbq("track", "ViewContent", {
    content_name: "Mama-Hafen Online-Kurs",
    content_category: "Online-Kurs",
    currency: "EUR",
    value: 97,
  });
}

/** Warteliste / Lead-Formular ausgefüllt */
export function trackLead() {
  fbq("track", "Lead", {
    content_name: "Mama-Hafen Warteliste",
    content_category: "Online-Kurs",
  });
}
