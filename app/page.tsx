import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PlannerClient } from "@/components/PlannerClient";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: events }, { data: tasks }, { data: profile }] =
    await Promise.all([
      supabase.from("events").select("*").order("start_date"),
      supabase.from("tasks").select("*").order("created_at"),
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle(),
    ]);

  return (
    <PlannerClient
      initialEvents={events ?? []}
      initialTasks={tasks ?? []}
      user={{
        id: user.id,
        email: user.email ?? "",
        name: profile?.name ?? user.email ?? "",
      }}
    />
  );
}
