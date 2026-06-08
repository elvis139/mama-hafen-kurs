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

/** Nur auf der Live-Domain feuern – keine Events auf Entwicklungs-URLs */
function isProductionDomain(): boolean {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  // Erlaubte Live-Domains
  const LIVE_DOMAINS = ["mamahafen.manus.space", "mamahafen-dswbdqtv.manus.space"];
  return LIVE_DOMAINS.some(d => hostname === d || hostname.endsWith("." + d));
}

function hasConsent(): boolean {
  try {
    return localStorage.getItem("mama_hafen_cookie_consent") === "accepted";
  } catch {
    return false;
  }
}

function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function fbq(event: string, eventName: string, params?: Record<string, unknown>) {
  if (!hasConsent()) return;
  if (!isProductionDomain()) return; // Keine Events auf Entwicklungs-URLs
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    const eventID = generateEventId();
    PIXEL_IDS.forEach(() => {
      window.fbq!(event, eventName, params, { eventID });
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
