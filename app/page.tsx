import { createClient } from "@/lib/supabase/server";
import { PlannerClient } from "@/components/PlannerClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const supabase = createClient();

  const [{ data: events }, { data: tasks }] = await Promise.all([
    supabase.from("events").select("*").order("start_date"),
    supabase.from("tasks").select("*").order("created_at"),
  ]);

  return (
    <PlannerClient
      initialEvents={events ?? []}
      initialTasks={tasks ?? []}
    />
  );
}
