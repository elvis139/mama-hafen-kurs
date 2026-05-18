export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  // CUSTOM_STRIPE_* wird bevorzugt (eigene Schlüssel), Fallback auf eingebaute System-Schlüssel
  // Live-Price-ID aktualisiert: price_1TYWdbAMLVk4y0D7CYYcmZDq
  stripeSecretKey: process.env.CUSTOM_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.CUSTOM_STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET || "",
  stripePriceId: process.env.CUSTOM_STRIPE_PRICE_ID || process.env.STRIPE_PRICE_ID || "",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
