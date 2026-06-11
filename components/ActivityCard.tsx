"use client";

import { CalendarEvent, CHILD_COLORS, EVENT_TYPE_LABELS } from "@/lib/types";
import { ChildBadge } from "./ChildBadge";
import { MapPin, Clock, Edit2, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

interface Props {
  event: CalendarEvent;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

// Parses "yyyy-MM-dd" to local midnight — avoids UTC timezone shift from parseISO
function localDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const UNASSIGNED = new Set(["TBD", "Не назначено"]);

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
      : event.child === "All"
      ? "border-l-amber-500"
      : event.child === "SashaVenya"
      ? "border-l-indigo-500"
      : event.child === "Ira"
      ? "border-l-rose-500"
      : "border-l-cyan-500"
  }`}
>
  <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">

          {/* Badge row */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <ChildBadge child={event.child} />
            <span className={`text-xs font-medium ${c.text}`}>
              {EVENT_TYPE_LABELS[event.type]}
            </span>
            {isMultiDay && (
              <span className="text-xs text-slate-400 ml-auto">
                {format(localDate(event.start_date), "d MMM", { locale: ru })} –{" "}
                {format(localDate(event.end_date),   "d MMM", { locale: ru })}
              </span>
            )}
          </div>

          {/* Title */}
          <p className="font-semibold text-slate-800 text-sm leading-snug mb-2">
            {event.title}
          </p>

          {/* Details */}
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
          </div>

          {/* Transport */}
          <div className="flex gap-4 mt-2">
            <div className="text-xs">
              <span className="text-slate-400">Отвозит </span>
              <span className={`font-medium ${UNASSIGNED.has(event.drop_off) ? "text-orange-500" : "text-slate-700"}`}>
                {event.drop_off}
              </span>
            </div>
            <div className="text-xs">
              <span className="text-slate-400">Забирает </span>
              <span className={`font-medium ${UNASSIGNED.has(event.pick_up) ? "text-orange-500" : "text-slate-700"}`}>
                {event.pick_up}
              </span>
            </div>
          </div>

          {event.notes && (
            <p className="text-xs text-slate-400 italic mt-1.5">{event.notes}</p>
          )}
        </div>

        {/* Action buttons */}
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

      {/* updated_at — parseISO is correct here: TIMESTAMPTZ includes timezone info */}
      <p className="text-xs text-slate-300 mt-2">
        {format(parseISO(event.updated_at), "dd.MM.yyyy HH:mm")}
      </p>
    </div>
  );
}
