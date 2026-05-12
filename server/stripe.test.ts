import { describe, it, expect } from "vitest";
import { ENV } from "./_core/env";

describe("Stripe Konfiguration", () => {
  it("stripeSecretKey ist gesetzt und beginnt mit sk_", () => {
    expect(ENV.stripeSecretKey).toBeTruthy();
    expect(ENV.stripeSecretKey).toMatch(/^sk_(live|test)_/);
  });

  it("stripePriceId ist gesetzt und beginnt mit price_", () => {
    expect(ENV.stripePriceId).toBeTruthy();
    expect(ENV.stripePriceId).toMatch(/^price_/);
  });

  it("stripeWebhookSecret ist gesetzt und beginnt mit whsec_", () => {
    expect(ENV.stripeWebhookSecret).toBeTruthy();
    expect(ENV.stripeWebhookSecret).toMatch(/^whsec_/);
  });

  it("CUSTOM_STRIPE_SECRET_KEY wird bevorzugt (eigener Account)", () => {
    // Der eigene Account-Key (TWCuH) muss Vorrang vor dem Manus-System-Key (TVDzw) haben
    const customKey = process.env.CUSTOM_STRIPE_SECRET_KEY;
    if (customKey) {
      expect(ENV.stripeSecretKey).toBe(customKey);
    }
  });
});
