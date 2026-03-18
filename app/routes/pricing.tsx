import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/pricing";
import { getSupabaseServerClient } from "../lib/supabase.server";
const TRIAL_DAYS = 7;

export function meta() {
  return [{ title: "Pricing | CuberWorld" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const { supabase } = getSupabaseServerClient(request);
    const { data: { user } } = await supabase.auth.getUser();

    let subscription = null;
    if (user) {
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();
      subscription = data;
    }

    return { user: user ? { id: user.id, email: user.email } : null, subscription };
  } catch {
    return { user: null, subscription: null };
  }
}

export default function PricingPage() {
  const { user, subscription } = useLoaderData<typeof loader>();

  const isTrialActive = subscription?.plan_type === "trial" &&
    subscription?.status === "active" &&
    new Date(subscription.trial_ends_at) > new Date();

  const hasFullAccess = subscription?.status === "active" &&
    (subscription.plan_type === "monthly" || subscription.plan_type === "lifetime");

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
          <span className="neon-magenta">UNLOCK AI ANALYZER</span>
        </h1>
        <p className="font-retro" style={{ color: "var(--text-dim)", fontSize: "1.2rem" }}>
          Get personalized AI feedback on every solve. Choose the plan that works for you.
        </p>
        <div style={{ marginTop: "1rem" }}>
          <span className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--yellow)" }}>
            ★ {TRIAL_DAYS}-DAY FREE TRIAL INCLUDED WITH EVERY ACCOUNT ★
          </span>
        </div>
      </div>

      {/* Current status */}
      {user && (
        <div style={{ marginBottom: "2.5rem" }}>
          {hasFullAccess && (
            <div className="alert-retro" style={{ textAlign: "center" }}>
              <span className="font-pixel" style={{ fontSize: "0.55rem", color: "var(--green)" }}>
                ✓ YOU HAVE FULL ACCESS — {subscription.plan_type.toUpperCase()} PLAN ACTIVE
              </span>
            </div>
          )}
          {isTrialActive && (
            <div className="alert-retro alert-warning" style={{ textAlign: "center" }}>
              <span className="font-pixel" style={{ fontSize: "0.5rem" }}>
                ⏱ FREE TRIAL ACTIVE — EXPIRES {new Date(subscription.trial_ends_at).toLocaleDateString()}
              </span>
            </div>
          )}
          {!hasFullAccess && !isTrialActive && subscription && (
            <div className="alert-retro alert-error" style={{ textAlign: "center" }}>
              <span className="font-pixel" style={{ fontSize: "0.5rem" }}>
                ✗ FREE TRIAL EXPIRED — UPGRADE TO CONTINUE
              </span>
            </div>
          )}
        </div>
      )}

      {/* Pricing Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>

        {/* Free Trial */}
        <div className="pricing-card" style={{ borderColor: "var(--green)" }}>
          <div className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--green)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
            FREE TRIAL
          </div>
          <div style={{ fontSize: "2.5rem", fontFamily: "'Press Start 2P', monospace", color: "var(--green)", marginBottom: "0.5rem" }}>
            $0
          </div>
          <div className="font-retro" style={{ color: "var(--text-dim)", marginBottom: "2rem", fontSize: "1rem" }}>
            7 days, no credit card
          </div>

          <ul className="font-retro" style={{ color: "var(--text-dim)", paddingLeft: "1rem", marginBottom: "2rem", listStyle: "none" }}>
            {["AI video analysis", "Personalized feedback", "Unlimited tutorials", "Virtual 3D cube", "Algorithm tracker"].map(f => (
              <li key={f} style={{ marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--green)", marginRight: "0.5rem" }}>✓</span>{f}
              </li>
            ))}
          </ul>

          {user ? (
            isTrialActive ? (
              <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--green)", textAlign: "center" }}>
                ✓ TRIAL ACTIVE
              </div>
            ) : (
              <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--text-dim)", textAlign: "center" }}>
                TRIAL USED
              </div>
            )
          ) : (
            <Link to="/register" className="btn-retro" style={{ width: "100%", textAlign: "center", display: "block" }}>
              START FREE TRIAL
            </Link>
          )}
        </div>

        {/* Monthly */}
        <div className="pricing-card featured">
          <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)" }}>
            <span className="font-pixel" style={{
              fontSize: "0.4rem", background: "var(--cyan)", color: "var(--bg)",
              padding: "0.25rem 0.75rem", whiteSpace: "nowrap"
            }}>
              MOST POPULAR
            </span>
          </div>
          <div className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--cyan)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
            MONTHLY
          </div>
          <div style={{ fontSize: "2rem", fontFamily: "'Press Start 2P', monospace", color: "var(--cyan)", marginBottom: "0.5rem" }}>
            $9.99
          </div>
          <div className="font-retro" style={{ color: "var(--text-dim)", marginBottom: "2rem", fontSize: "1rem" }}>
            per month, cancel anytime
          </div>

          <ul className="font-retro" style={{ color: "var(--text-dim)", paddingLeft: "1rem", marginBottom: "2rem", listStyle: "none" }}>
            {["Everything in Free Trial", "Unlimited AI analyses", "Detailed move breakdown", "Progress history", "Priority support"].map(f => (
              <li key={f} style={{ marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--cyan)", marginRight: "0.5rem" }}>✓</span>{f}
              </li>
            ))}
          </ul>

          {hasFullAccess && subscription?.plan_type === "monthly" ? (
            <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--cyan)", textAlign: "center" }}>✓ YOUR PLAN</div>
          ) : (
            <form method="post" action="/api/checkout">
              <input type="hidden" name="plan" value="monthly" />
              <button type="submit" className="btn-retro btn-retro-cyan" style={{ width: "100%" }}>
                SUBSCRIBE MONTHLY
              </button>
            </form>
          )}
        </div>

        {/* Lifetime */}
        <div className="pricing-card" style={{ borderColor: "var(--yellow)" }}>
          <div className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--yellow)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
            LIFETIME ACCESS
          </div>
          <div style={{ fontSize: "2rem", fontFamily: "'Press Start 2P', monospace", color: "var(--yellow)", marginBottom: "0.5rem" }}>
            $49.99
          </div>
          <div className="font-retro" style={{ color: "var(--text-dim)", marginBottom: "2rem", fontSize: "1rem" }}>
            one-time payment, forever
          </div>

          <ul className="font-retro" style={{ color: "var(--text-dim)", paddingLeft: "1rem", marginBottom: "2rem", listStyle: "none" }}>
            {["Everything in Monthly", "Lifetime access", "All future features", "No recurring charges", "VIP badge"].map(f => (
              <li key={f} style={{ marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--yellow)", marginRight: "0.5rem" }}>✓</span>{f}
              </li>
            ))}
          </ul>

          {hasFullAccess && subscription?.plan_type === "lifetime" ? (
            <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--yellow)", textAlign: "center" }}>✓ YOUR PLAN</div>
          ) : (
            <form method="post" action="/api/checkout">
              <input type="hidden" name="plan" value="lifetime" />
              <button type="submit" className="btn-retro btn-retro-yellow" style={{ width: "100%" }}>
                GET LIFETIME ACCESS
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="retro-box">
        <h2 style={{ fontSize: "0.75rem", marginBottom: "2rem" }}>FREQUENTLY ASKED QUESTIONS</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {[
            {
              q: "DO I NEED A CREDIT CARD FOR THE FREE TRIAL?",
              a: "No. Your 7-day free trial starts automatically when you create an account. No payment required.",
            },
            {
              q: "CAN I CANCEL MY MONTHLY SUBSCRIPTION?",
              a: "Yes, cancel anytime from your account settings. You keep access until the end of your billing period.",
            },
            {
              q: "WHAT DOES THE AI ANALYZER ACTUALLY DO?",
              a: "You record yourself solving the cube with your webcam. Our AI analyzes your hand movements, timing, and technique to give you specific, actionable feedback.",
            },
            {
              q: "ARE THE TUTORIALS FREE?",
              a: "Yes! All tutorials (CFOP, Roux, Blindfolded) and the virtual 3D cube are completely free. AI Analyzer is the only paid feature.",
            },
          ].map(item => (
            <div key={item.q} style={{ borderLeft: "2px solid var(--border)", paddingLeft: "1rem" }}>
              <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--cyan)", marginBottom: "0.5rem" }}>{item.q}</div>
              <div className="font-retro" style={{ color: "var(--text-dim)" }}>{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
