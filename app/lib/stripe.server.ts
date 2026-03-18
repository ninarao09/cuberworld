import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return stripeInstance;
}

export const PLANS = {
  monthly: {
    name: "Monthly",
    price: 9.99,
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    interval: "month" as const,
  },
  lifetime: {
    name: "Lifetime",
    price: 49.99,
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID!,
    interval: "one_time" as const,
  },
} as const;

export const TRIAL_DAYS = 7;
