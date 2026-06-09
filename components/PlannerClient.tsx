"use client";
import { useState, useEffect } from "react";
import { CalendarEvent, Task, Child, EventSlot } from "@/lib/types";
import { getAllDays, groupByWeek, isEventOnDay } from "@/lib/dates";
import { createClient } from "@/lib/supabase/client";
import { DayCard } from "./DayCard";
import { TaskPanel } from "./TaskPanel";
import { FilterBar } from "./FilterBar";
import { EventModal } from "./EventModal";
import { PlanningPanel } from "./PlanningPanel";
import { format } from "date-fns";
import { Sun } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface Props {
  initialEvents: CalendarEvent[];
  initialTasks: Task[];
}

type FilterChild = Child | "All";

export function PlannerClient({ initialEvents, initialTasks }: Props)
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<FilterChild>("All");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [defaultDate, setDefaultDate] = useState<Date | undefined>();
  const [defaultSlot, setDefaultSlot] = useState<EventSlot>("daytime");

  const router = useRouter();
  const supabase = createClient();
  const weeks = groupByWeek(getAllDays());

  // Realtime subscriptions
  useEffect(() => {
    const channel = supabase
      .channel("planner-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (payload) => {
          if (payload.eventType === "INSERT")
            setEvents((prev) => [...prev, payload.new as CalendarEvent]);
          if (payload.eventType === "UPDATE")
            setEvents((prev) =>
              prev.map((e) =>
                e.id === payload.new.id ? (payload.new as CalendarEvent) : e
              )
            );
          if (payload.eventType === "DELETE")
            setEvents((prev) =>
              prev.filter((e) => e.id !== (payload.old as CalendarEvent).id)
            );
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          if (payload.eventType === "INSERT")
            setTasks((prev) => [...prev, payload.new as Task]);
          if (payload.eventType === "UPDATE")
            setTasks((prev) =>
              prev.map((t) =>
                t.id === payload.new.id ? (payload.new as Task) : t
              )
            );
          if (payload.eventType === "DELETE")
            setTasks((prev) =>
              prev.filter((t) => t.id !== (payload.old as Task).id)
            );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Filtering
  const filteredEvents = events.filter((e) => {
    if (filter !== "All" && e.child !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.child.toLowerCase().includes(q) ||
        (e.location ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  function getEventsForDay(day: Date) {
    return filteredEvents.filter((e) => isEventOnDay(e, day));
  }

  // Modal handlers
  function openAdd(day: Date, slot: EventSlot) {
    setEditingEvent(null);
    setDefaultDate(day);
    setDefaultSlot(slot);
    setModalOpen(true);
  }

  function openEdit(event: CalendarEvent) {
    setEditingEvent(event);
    setModalOpen(true);
  }

  // CRUD — events
  async function handleSaveEvent(data: Partial<CalendarEvent>) {
    if (editingEvent) {
      await supabase
        .from("events")
        .update({ ...data, updated_by: user.id })
        .eq("id", editingEvent.id);
    } else {
      await supabase
        .from("events")
        .insert({ ...data, created_by: user.id, updated_by: user.id });
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!window.confirm("Delete this activity?")) return;
    await supabase.from("events").delete().eq("id", id);
  }

  // CRUD — tasks
  async function handleToggleTask(id: string, completed: boolean) {
    await supabase
      .from("tasks")
      .update({ completed, updated_by: user.id })
      .eq("id", id);
  }

  async function handleAddTask(title: string) {
    await supabase
      .from("tasks")
      .insert({ title, created_by: user.id, updated_by: user.id });
  }

  async function handleDeleteTask(id: string) {
    await supabase.from("tasks").delete().eq("id", id);
  }

  async function handleEditTask(id: string, title: string) {
    await supabase
      .from("tasks")
      .update({ title, updated_by: user.id })
      .eq("id", id);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sun size={22} className="text-yellow-400 shrink-0" />
            <div>
              <h1 className="font-bold text-slate-800 text-base leading-tight">
                Family Summer Planner
              </h1>
              <p className="text-xs text-slate-400">June 22 – July 20, 2025</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend dots */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                Venya
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                Sasha
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                Gavr
              </span>
            </div>
      </header>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <FilterBar
          filter={filter}
          search={search}
          onFilterChange={setFilter}
          onSearchChange={setSearch}
        />

        <div className="flex gap-6 items-start">
          {/* Calendar column */}
          <div className="flex-1 min-w-0 space-y-8">
            {weeks.map((week, wi) => (
              <section key={wi}>
                {/* Week header */}
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Week {wi + 1}
                  </h2>
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {format(week[0], "MMM d")} –{" "}
                    {format(week[week.length - 1], "MMM d")}
                  </span>
                </div>

                <div className="space-y-4">
                  {week.map((day) => (
                    <DayCard
                      key={day.toISOString()}
                      day={day}
                      events={getEventsForDay(day)}
                      onAdd={openAdd}
                      onEdit={openEdit}
                      onDelete={handleDeleteEvent}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Sidebar (desktop) */}
          <aside className="w-80 shrink-0 hidden lg:flex flex-col gap-4 sticky top-20">
            <TaskPanel
              tasks={tasks}
              onToggle={handleToggleTask}
              onAdd={handleAddTask}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
            <PlanningPanel />
          </aside>
        </div>

        {/* Sidebar (mobile — below calendar) */}
        <div className="lg:hidden mt-8 space-y-4">
          <TaskPanel
            tasks={tasks}
            onToggle={handleToggleTask}
            onAdd={handleAddTask}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
          <PlanningPanel />
        </div>
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <EventModal
          event={editingEvent}
          defaultDate={defaultDate}
          defaultSlot={defaultSlot}
          onSave={handleSaveEvent}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
