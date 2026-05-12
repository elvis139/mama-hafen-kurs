import { describe, it, expect } from "vitest";

describe("Stripe Secrets", () => {
  it("STRIPE_PRICE_ID is set and has correct format", () => {
    const priceId = process.env.STRIPE_PRICE_ID;
    expect(priceId).toBeTruthy();
    expect(priceId).toMatch(/^price_/);
  });

  it("STRIPE_SECRET_KEY is set and has correct format", () => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    expect(secretKey).toBeTruthy();
    expect(secretKey).toMatch(/^sk_(live|test)_/);
  });

  it("STRIPE_WEBHOOK_SECRET is set and has correct format", () => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    expect(webhookSecret).toBeTruthy();
    expect(webhookSecret).toMatch(/^whsec_/);
  });
});
