import { Form, Link, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/register";
import { getSupabaseServerClient } from "../lib/supabase.server";
import { getSupabaseAdminClient } from "../lib/supabase.server";
import { TRIAL_DAYS } from "../lib/stripe.server";

export function meta() {
  return [{ title: "Register | CuberWorld" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = getSupabaseServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return redirect("/");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = getSupabaseServerClient(request);
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!email || !password || !confirm) {
    return { error: "ALL FIELDS REQUIRED." };
  }
  if (password !== confirm) {
    return { error: "PASSWORDS DO NOT MATCH." };
  }
  if (password.length < 6) {
    return { error: "PASSWORD MUST BE AT LEAST 6 CHARACTERS." };
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message.toUpperCase() };
  }

  // Create trial subscription record
  if (data.user) {
    try {
      const admin = getSupabaseAdminClient();
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);
      await admin.from("subscriptions").insert({
        user_id: data.user.id,
        plan_type: "trial",
        status: "active",
        trial_ends_at: trialEnd.toISOString(),
      });
    } catch {
      // Non-critical – don't fail registration
    }
  }

  return redirect("/", { headers });
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
            <span className="neon-cyan">CREATE ACCOUNT</span>
          </h1>
          <p className="font-retro" style={{ color: "var(--text-dim)" }}>
            JOIN THE CUBERWORLD COMMUNITY
          </p>
          <div style={{ marginTop: "0.75rem" }}>
            <span className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--yellow)" }}>
              ★ FREE 7-DAY TRIAL INCLUDED ★
            </span>
          </div>
        </div>

        <div className="retro-box-cyan">
          <div className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--border)", marginBottom: "1.5rem", textAlign: "center" }}>
            ┌─────────────────────────────┐<br />
            │   &gt;&gt; NEW PLAYER SETUP      │<br />
            └─────────────────────────────┘
          </div>

          {actionData?.error && (
            <div className="alert-retro alert-error" style={{ marginBottom: "1.5rem" }}>
              <span className="font-pixel" style={{ fontSize: "0.55rem" }}>✗ {actionData.error}</span>
            </div>
          )}

          <Form method="post" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label htmlFor="email" className="label-retro">EMAIL ADDRESS</label>
              <input
                id="email"
                type="email"
                name="email"
                className="input-retro"
                placeholder="player@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label-retro">PASSWORD (MIN 6 CHARS)</label>
              <input
                id="password"
                type="password"
                name="password"
                className="input-retro"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="label-retro">CONFIRM PASSWORD</label>
              <input
                id="confirm"
                type="password"
                name="confirm"
                className="input-retro"
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn-retro btn-retro-cyan"
              disabled={isSubmitting}
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              {isSubmitting ? "CREATING ACCOUNT..." : "► CREATE ACCOUNT"}
            </button>
          </Form>

          <div className="retro-divider" />

          <p className="font-retro" style={{ textAlign: "center", color: "var(--text-dim)" }}>
            ALREADY A MEMBER?{" "}
            <Link to="/login" style={{ color: "var(--green)", textDecoration: "none" }}>
              LOGIN HERE
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
