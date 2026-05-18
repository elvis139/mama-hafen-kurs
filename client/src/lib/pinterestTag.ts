/**
 * Pinterest Tag Helper
 * Tag ID: 2614439815904
 *
 * Events: page, ViewContent, InitiateCheckout, AddToCart, Lead, Checkout
 * Docs: https://help.pinterest.com/en/business/article/track-conversions-with-pinterest-tag
 */

declare global {
  interface Window {
    pintrk?: (...args: unknown[]) => void;
  }
}

function hasConsent(): boolean {
  try {
    return localStorage.getItem("mama_hafen_cookie_consent") === "accepted";
  } catch {
    return false;
  }
}

function pintrk(event: string, eventName?: string, params?: Record<string, unknown>) {
  if (!hasConsent()) return;
  if (typeof window !== "undefined" && typeof window.pintrk === "function") {
    if (eventName) {
      window.pintrk(event, eventName, params ?? {});
    } else {
      window.pintrk(event);
    }
  }
}

/** Seitenaufruf – wird automatisch beim Laden der Seite gefeuert */
export function pinterestPageView() {
  pintrk("page");
}

/** Produktseite angesehen */
export function pinterestViewContent(value?: number) {
  pintrk("track", "ViewContent", {
    value: value ?? 99,
    currency: "EUR",
    content_ids: ["mama-hafen-kurs"],
    content_name: "Mama-Hafen Online-Kurs",
    content_category: "Online-Kurs",
  });
}

/** Kauf-Button geklickt – Checkout gestartet */
export function pinterestInitiateCheckout(value?: number) {
  pintrk("track", "InitiateCheckout", {
    value: value ?? 99,
    currency: "EUR",
    content_ids: ["mama-hafen-kurs"],
    content_name: "Mama-Hafen Online-Kurs",
    content_category: "Online-Kurs",
    num_items: 1,
  });
}

/** Lead / Warteliste ausgefüllt */
export function pinterestLead() {
  pintrk("track", "Lead", {
    content_name: "Mama-Hafen Warteliste",
    content_category: "Online-Kurs",
  });
}

/** Kauf erfolgreich abgeschlossen (Stripe success page) */
export function pinterestPurchase(value?: number, orderId?: string) {
  pintrk("track", "Checkout", {
    value: value ?? 99,
    currency: "EUR",
    content_ids: ["mama-hafen-kurs"],
    content_name: "Mama-Hafen Online-Kurs",
    content_category: "Online-Kurs",
    num_items: 1,
    order_id: orderId ?? "",
  });
}
