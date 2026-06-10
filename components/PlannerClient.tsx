"use client";

import { useState, useEffect } from "react";
import { CalendarEvent, Task, Child, EventSlot } from "@/lib/types";
import { getAllDays, groupByWeek, isEventOnDay } from "@/lib/dates";
import { createClient } from "@/lib/supabase/client";
import { DayCard } from "./DayCard";
import { TaskPanel } from "./TaskPanel";
import { EventModal } from "./EventModal";
import { format } from "date-fns"; 
import { ru } from "date-fns/locale";
import { Sun } from "lucide-react";

interface Props {
  initialEvents: CalendarEvent[];
  initialTasks: Task[];
}

export function PlannerClient({ initialEvents, initialTasks }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [defaultDate, setDefaultDate] = useState<Date | undefined>();
  const [defaultSlot, setDefaultSlot] = useState<EventSlot>("daytime");

  const [supabase] = useState(() => createClient());
  const weeks = groupByWeek(getAllDays());

  useEffect(() => {
    const channel = supabase
      .channel("planner-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setEvents((prev) => [...prev, payload.new as CalendarEvent]);
          }

          if (payload.eventType === "UPDATE") {
            setEvents((prev) =>
              prev.map((event) =>
                event.id === payload.new.id
                  ? (payload.new as CalendarEvent)
                  : event
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setEvents((prev) =>
              prev.filter(
                (event) => event.id !== (payload.old as CalendarEvent).id
              )
            );
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTasks((prev) => [...prev, payload.new as Task]);
          }

          if (payload.eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((task) =>
                task.id === payload.new.id ? (payload.new as Task) : task
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setTasks((prev) =>
              prev.filter((task) => task.id !== (payload.old as Task).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const filteredEvents = events;

  function getEventsForDay(day: Date) {
    return filteredEvents.filter((event) => isEventOnDay(event, day));
  }
function openAdd(day: Date) {
  setEditingEvent(null);
  setDefaultDate(day);
  setDefaultSlot("daytime");
  setModalOpen(true);
}

  function openEdit(event: CalendarEvent) {
    setEditingEvent(event);
    setModalOpen(true);
  }
async function handleSaveEvent(data: Partial<CalendarEvent>) {
  if (editingEvent) {
    const { data: updatedEvent, error } = await supabase
      .from("events")
      .update(data)
      .eq("id", editingEvent.id)
      .select()
      .single();

    if (error) {
      alert(`Ошибка сохранения мероприятия: ${error.message}`);
      return;
    }

    setEvents((prev) =>
      prev.map((event) =>
        event.id === editingEvent.id ? (updatedEvent as CalendarEvent) : event
      )
    );
  } else {
    const { data: newEvent, error } = await supabase
      .from("events")
      .insert(data)
      .select()
      .single();

    if (error) {
      alert(`Ошибка добавления мероприятия: ${error.message}`);
      return;
    }

    setEvents((prev) => [...prev, newEvent as CalendarEvent]);
  }

async function handleDeleteEvent(id: string) {
  if (!window.confirm("Удалить это мероприятие?")) return;

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    alert(`Ошибка удаления мероприятия: ${error.message}`);
    return;
  }

  setEvents((prev) => prev.filter((event) => event.id !== id));
}

async function handleToggleTask(id: string, completed: boolean) {
  const { error } = await supabase
    .from("tasks")
    .update({ completed })
    .eq("id", id);

  if (error) {
    alert(`Ошибка обновления задачи: ${error.message}`);
    return;
  }

  setTasks((prev) =>
    prev.map((task) => (task.id === id ? { ...task, completed } : task))
  );
}

async function handleAddTask(title: string) {
  const { data, error } = await supabase
    .from("tasks")
    .insert({ title, completed: false })
    .select();

  if (error) {
    alert(`Ошибка добавления задачи: ${error.message}`);
    return;
  }

  if (!data || data.length === 0) {
    alert("Задача не сохранилась в базе: Supabase не вернул новую запись.");
    return;
  }

setTasks((prev) => [...prev, data[0] as Task]);
}

async function handleDeleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    alert(`Ошибка удаления задачи: ${error.message}`);
    return;
  }

  setTasks((prev) => prev.filter((task) => task.id !== id));
}

async function handleEditTask(id: string, title: string) {
  const { data: updatedTask, error } = await supabase
    .from("tasks")
    .update({ title })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    alert(`Ошибка редактирования задачи: ${error.message}`);
    return;
  }

  setTasks((prev) =>
    prev.map((task) => (task.id === id ? (updatedTask as Task) : task))
  );

  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sun size={22} className="text-yellow-400 shrink-0" />
            <div>
              <h1 className="font-bold text-slate-800 text-base leading-tight">
                Семейный календарь
              </h1>
              <p className="text-xs text-slate-400">22 июня – 20 июля 2026</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              Веня
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
              Саша
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
              Гавр
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0 space-y-8">
            {weeks.map((week, weekIndex) => (
              <section key={weekIndex}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Неделя {weekIndex + 1}
                  </h2>
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                   {format(week[0], "d MMM", { locale: ru })} –{" "}
                    {format(week[week.length - 1], "d MMM", { locale: ru })}
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
<aside className="w-80 shrink-0 hidden lg:flex flex-col gap-4 sticky top-20">
  <TaskPanel
    tasks={tasks}
    onToggle={handleToggleTask}
    onAdd={handleAddTask}
    onDelete={handleDeleteTask}
    onEdit={handleEditTask}
  />
</aside>
        </div>

       <div className="lg:hidden mt-8 space-y-4">
  <TaskPanel
    tasks={tasks}
    onToggle={handleToggleTask}
    onAdd={handleAddTask}
    onDelete={handleDeleteTask}
    onEdit={handleEditTask}
  />
</div>
      </div>

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
