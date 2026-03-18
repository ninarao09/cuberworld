import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import { getSupabaseServerClient } from "../lib/supabase.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = getSupabaseServerClient(request);
  await supabase.auth.signOut();
  return redirect("/", { headers });
}

export default function Logout() {
  return null;
}
