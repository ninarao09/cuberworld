import type { Route } from "./+types/api.webhook";
import { getStripe } from "../lib/stripe.server";

export async function action({ request }: Route.ActionArgs) {
  const stripe = getStripe();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: any;
  const body = await request.text();

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Lazy-import Supabase admin to avoid SSR issues
  const { createClient } = await import("@supabase/supabase-js");
  const admin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        if (!userId || !plan) break;

        if (plan === "lifetime") {
          await admin.from("subscriptions").upsert({
            user_id: userId,
            plan_type: "lifetime",
            status: "active",
            stripe_customer_id: session.customer,
          }, { onConflict: "user_id" });
        } else if (plan === "monthly") {
          const sub = await getStripe().subscriptions.retrieve(session.subscription as string);
          await admin.from("subscriptions").upsert({
            user_id: userId,
            plan_type: "monthly",
            status: "active",
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
          }, { onConflict: "user_id" });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        const { data: record } = await admin
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", sub.id)
          .single();

        if (record) {
          await admin.from("subscriptions").update({
            status: sub.status === "active" ? "active" : "cancelled",
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          }).eq("stripe_subscription_id", sub.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await admin.from("subscriptions").update({
          status: "cancelled",
        }).eq("stripe_subscription_id", sub.id);
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response("Handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function loader() {
  return new Response("Method not allowed", { status: 405 });
}
