import { Form, Link, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/login";
import { getSupabaseServerClient } from "../lib/supabase.server";

export function meta() {
  return [{ title: "Login | CuberWorld" }];
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = getSupabaseServerClient(request);
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "EMAIL AND PASSWORD REQUIRED." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message.toUpperCase() };
  }

  return redirect("/", { headers });
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = getSupabaseServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return redirect("/");
  return null;
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
            <span className="neon-green">PLAYER LOGIN</span>
          </h1>
          <p className="font-retro" style={{ color: "var(--text-dim)" }}>
            ENTER YOUR CREDENTIALS TO CONTINUE
          </p>
        </div>

        <div className="retro-box">
          {/* ASCII decoration */}
          <div className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--border)", marginBottom: "1.5rem", textAlign: "center" }}>
            ┌─────────────────────────────┐<br />
            │   &gt;&gt; SECURE ACCESS PORTAL   │<br />
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
              <label htmlFor="password" className="label-retro">PASSWORD</label>
              <input
                id="password"
                type="password"
                name="password"
                className="input-retro"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn-retro"
              disabled={isSubmitting}
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              {isSubmitting ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <span className="spinner" style={{ width: "14px", height: "14px", borderWidth: "1px" }} />
                  LOGGING IN...
                </span>
              ) : "► LOGIN"}
            </button>
          </Form>

          <div className="retro-divider" />

          <p className="font-retro" style={{ textAlign: "center", color: "var(--text-dim)" }}>
            NO ACCOUNT?{" "}
            <Link to="/register" style={{ color: "var(--cyan)", textDecoration: "none" }}>
              REGISTER HERE
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
