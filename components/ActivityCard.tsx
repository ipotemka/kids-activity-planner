"use client";

import { CalendarEvent, CHILD_COLORS } from "@/lib/types";
import { ChildBadge } from "./ChildBadge";
import { MapPin, Clock, Edit2, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";

interface Props {
  event: CalendarEvent;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

export function ActivityCard({ event, onEdit, onDelete }: Props) {
  const c = CHILD_COLORS[event.child];
  const isMultiDay = event.start_date !== event.end_date;

  return (
    <div
className={`rounded-xl bg-white shadow-sm p-3 group relative border-l-4 ${
  event.child === "Venya"
    ? "border-l-blue-500"
    : event.child === "Sasha"
    ? "border-l-purple-500"
    : event.child === "Gavr"
    ? "border-l-green-500"
    : event.child === "SashaVenya"
    ? "border-l-indigo-500"
    : "border-l-amber-500"
}`}      >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <ChildBadge child={event.child} />

            <span className={`text-xs font-medium ${c.text}`}>
              {event.type}
            </span>

            {isMultiDay && (
              <span className="text-xs text-slate-400 ml-auto">
                {format(parseISO(event.start_date), "dd.MM")} –{" "}
                {format(parseISO(event.end_date), "dd.MM")}
              </span>
            )}
          </div>

          <p className="font-semibold text-slate-800 text-sm leading-snug mb-2">
            {event.title}
          </p>

          <div className="space-y-1">
            {(event.start_time || event.end_time) && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock size={11} className="shrink-0" />
                <span>
                  {event.start_time?.slice(0, 5)}
                  {event.end_time ? ` – ${event.end_time.slice(0, 5)}` : ""}
                </span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin size={11} className="shrink-0" />
                <span>{event.location}</span>
              </div>
            )}

            {event.pick_up && event.pick_up !== "TBD" && (
              <div className="text-xs text-slate-500">
                <span className="text-slate-400">Забирает: </span>
                <span className="font-medium text-slate-700">
                  {event.pick_up}
                </span>
              </div>
            )}
          </div>

          {event.notes && (
            <p className="text-xs text-slate-400 italic mt-1.5">
              {event.notes}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(event)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Редактировать"
          >
            <Edit2 size={13} />
          </button>

          <button
            onClick={() => onDelete(event.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
            title="Удалить"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-300 mt-2">
        Обновлено {format(parseISO(event.updated_at), "dd.MM.yyyy HH:mm")}
      </p>
    </div>
  );
}
