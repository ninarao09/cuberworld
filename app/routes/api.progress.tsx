import type { Route } from "./+types/api.progress";
import { getSupabaseServerClient } from "../lib/supabase.server";

export async function action({ request }: Route.ActionArgs) {
  const { supabase } = getSupabaseServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const formData = await request.formData();
  const algorithmId = formData.get("algorithmId") as string;
  const learned = formData.get("learned") === "true";

  if (!algorithmId) {
    return new Response(JSON.stringify({ error: "Missing algorithmId" }), { status: 400 });
  }

  const { error } = await supabase.from("algorithm_progress").upsert(
    {
      user_id: user.id,
      algorithm_id: algorithmId,
      learned,
      learned_at: learned ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,algorithm_id" }
  );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, algorithmId, learned }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function loader() {
  return new Response("Method not allowed", { status: 405 });
}
