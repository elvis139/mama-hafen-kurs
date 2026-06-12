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
        // Bei 100% Rabatt ist payment_status "no_payment_required" – trotzdem als bezahlt werten
        const isPaid = session.payment_status === "paid" || session.payment_status === "no_payment_required";
        // Bei 0€ (Gutschein) den Originalpreis aus den Line Items verwenden (Fallback: 99€)
        const rawAmount = session.amount_total ?? 0;
        const amount = rawAmount > 0 ? rawAmount / 100 : 99;
        return {
          paid: isPaid,
          amount,
          currency: session.currency ?? "eur",
        };
      } catch (err) {
        // Invalid session ID or Stripe error → treat as not paid
        console.error("[payment.verifySession] Error:", err);
        return { paid: false, amount: null, currency: null };
      }
    }),
});
