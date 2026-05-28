import { z } from "zod";
import Stripe from "stripe";
import { publicProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";

let stripeInstance: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(ENV.stripeSecretKey);
  }
  return stripeInstance;
}

export const paymentRouter = router({
  /**
   * Verifies a Stripe checkout session server-side.
   * Returns { paid: true } only if payment_status === 'paid'.
   * This prevents the Meta Pixel Purchase event from firing on fake/direct URL visits.
   */
  verifySession: publicProcedure
    .input(z.object({ sessionId: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        return {
          paid: session.payment_status === "paid",
          amount: session.amount_total ? session.amount_total / 100 : null,
          currency: session.currency ?? null,
        };
      } catch (err) {
        // Invalid session ID or Stripe error → treat as not paid
        console.error("[payment.verifySession] Error:", err);
        return { paid: false, amount: null, currency: null };
      }
    }),
});
