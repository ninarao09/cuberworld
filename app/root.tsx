import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink,
  useLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { getSupabaseServerClient } from "./lib/supabase.server";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
];

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const { supabase } = getSupabaseServerClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    return { user: user ? { id: user.id, email: user.email } : null };
  } catch {
    return { user: null };
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  const user = data?.user ?? null;

  return (
    <>
      <nav className="nav-retro">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
            {/* Logo */}
            <NavLink to="/" style={{ textDecoration: 'none' }}>
              <span className="font-pixel neon-green" style={{ fontSize: '0.7rem' }}>
                ■ CUBERWORLD
              </span>
            </NavLink>

            {/* Main Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
              <NavLink to="/tutorials" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                TUTORIALS
              </NavLink>
              <NavLink to="/cube" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                3D CUBE
              </NavLink>
              <NavLink to="/analyzer" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                AI ANALYZER
              </NavLink>
              <NavLink to="/pricing" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                PRICING
              </NavLink>
            </div>

            {/* Auth */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {user ? (
                <>
                  <span className="font-retro" style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                    {user.email?.split('@')[0]}
                  </span>
                  <NavLink to="/logout" className="btn-retro" style={{ padding: '0.4rem 0.8rem', fontSize: '0.5rem' }}>
                    LOGOUT
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="btn-retro" style={{ padding: '0.4rem 0.8rem', fontSize: '0.5rem' }}>
                    LOGIN
                  </NavLink>
                  <NavLink to="/register" className="btn-retro btn-retro-cyan" style={{ padding: '0.4rem 0.8rem', fontSize: '0.5rem' }}>
                    SIGN UP
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Outlet />

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1rem', marginTop: '4rem', textAlign: 'center' }}>
        <p className="font-pixel" style={{ fontSize: '0.45rem', color: 'var(--text-dim)', letterSpacing: '0.15em' }}>
          © 2024 CUBERWORLD &nbsp;|&nbsp; FOR SPEEDCUBERS, BY SPEEDCUBERS
        </p>
        <p className="font-retro" style={{ color: 'var(--border)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          TWIST. SOLVE. DOMINATE.
        </p>
      </footer>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "ERROR";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : `ERROR ${error.status}`;
    details = error.status === 404 ? "PAGE NOT FOUND." : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 className="neon-red font-pixel" style={{ fontSize: '2rem', marginBottom: '1rem' }}>{message}</h1>
      <p className="font-retro" style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginBottom: '1rem' }}>{details}</p>
      {stack && (
        <pre style={{ textAlign: 'left', background: 'var(--bg2)', border: '1px solid var(--border)', padding: '1rem', overflow: 'auto', fontSize: '0.75rem', color: 'var(--red)' }}>
          {stack}
        </pre>
      )}
      <NavLink to="/" className="btn-retro" style={{ marginTop: '2rem', display: 'inline-block' }}>
        ← GO HOME
      </NavLink>
    </div>
  );
}
