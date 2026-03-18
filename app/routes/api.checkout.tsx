import { redirect } from "react-router";
import type { Route } from "./+types/api.checkout";
import { getSupabaseServerClient } from "../lib/supabase.server";
import { getStripe, PLANS } from "../lib/stripe.server";

export async function action({ request }: Route.ActionArgs) {
  const { supabase } = getSupabaseServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const formData = await request.formData();
  const plan = formData.get("plan") as "monthly" | "lifetime";

  if (!PLANS[plan]) {
    return new Response("Invalid plan", { status: 400 });
  }

  const stripe = getStripe();
  const origin = new URL(request.url).origin;

  try {
    if (plan === "lifetime") {
      // One-time payment
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "CuberWorld Lifetime Access" },
              unit_amount: Math.round(PLANS.lifetime.price * 100),
            },
            quantity: 1,
          },
        ],
        customer_email: user.email,
        metadata: { userId: user.id, plan: "lifetime" },
        success_url: `${origin}/analyzer?success=true`,
        cancel_url: `${origin}/pricing`,
      });
      return redirect(session.url!);
    } else {
      // Subscription
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: PLANS.monthly.priceId,
            quantity: 1,
          },
        ],
        customer_email: user.email,
        metadata: { userId: user.id, plan: "monthly" },
        success_url: `${origin}/analyzer?success=true`,
        cancel_url: `${origin}/pricing`,
      });
      return redirect(session.url!);
    }
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return redirect("/pricing?error=checkout_failed");
  }
}

export async function loader() {
  return redirect("/pricing");
}
