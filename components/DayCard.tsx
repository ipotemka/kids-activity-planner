"use client";

import { CalendarEvent, Child, CHILD_COLORS } from "@/lib/types";
import { ActivityCard } from "./ActivityCard";
import { format, isWeekend, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Plus } from "lucide-react";

interface Props {
  day: Date;
  events: CalendarEvent[];
  onAdd: (day: Date) => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

export function DayCard({ day, events, onAdd, onEdit, onDelete }: Props) {
  const weekend = isWeekend(day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cardDay = new Date(day);
  cardDay.setHours(0, 0, 0, 0);

  const isPast = cardDay < today;
  const isToday = isSameDay(cardDay, today);

  const children = Array.from(new Set(events.map((event) => event.child)));

  const sortedEvents = [...events].sort((a, b) =>
    (a.start_time ?? "99:99").localeCompare(b.start_time ?? "99:99")
  );

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-sm transition-shadow hover:shadow-md ${
        isPast
          ? "border-slate-200 bg-slate-100 opacity-60"
          : isToday
          ? "border-blue-300 bg-blue-50/30 ring-2 ring-blue-200"
          : weekend
          ? "border-amber-200 bg-amber-50/30"
          : "border-slate-100 bg-white"
      }`}
    >
      <div
        className={`px-5 py-3 flex items-center justify-between ${
          isPast
            ? "bg-slate-200"
            : isToday
            ? "bg-blue-50"
            : weekend
            ? "bg-amber-50"
            : "bg-slate-50/80"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="text-center w-10">
            <div className="text-3xl font-black text-slate-800 leading-none">
              {format(day, "d")}
            </div>

            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              {format(day, "MMM", { locale: ru })}
            </div>
          </div>

          <div>
            <div className="font-semibold text-slate-700 capitalize">
              {format(day, "EEEE", { locale: ru })}
            </div>

            <div className="flex gap-1 mt-0.5">
              {isToday && (
                <span className="inline-block text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                  Сегодня
                </span>
              )}

              {weekend && (
                <span className="inline-block text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                  Выходной
                </span>
              )}

              {isPast && (
                <span className="inline-block text-xs bg-slate-300 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                  Прошло
                </span>
              )}
            </div>
          </div>
        </div>

        {children.length > 0 && (
          <div className="flex items-center gap-1.5">
            {children.map((child) => (
              <div
                key={child}
                className={`w-3 h-3 rounded-full ${
                  CHILD_COLORS[child as Child].dot
                }`}
                title={child}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-3 space-y-2">
        {sortedEvents.map((event) => (
          <ActivityCard
            key={event.id}
            event={event}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}

        <button
          onClick={() => onAdd(day)}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 border border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl py-2.5 transition group"
        >
          <Plus
            size={12}
            className="group-hover:scale-125 transition-transform"
          />
          Добавить мероприятие
        </button>
      </div>
    </div>
  );
}
