"use client";
import { CalendarEvent, EventSlot, Child, CHILD_COLORS, SLOT_LABELS } from "@/lib/types";
import { ActivityCard } from "./ActivityCard";
import { format, isWeekend } from "date-fns";
import { Plus } from "lucide-react";

const SLOTS: EventSlot[] = ["daytime", "after-camp", "evening"];

interface Props {
  day: Date;
  events: CalendarEvent[];
  onAdd: (day: Date, slot: EventSlot) => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

export function DayCard({ day, events, onAdd, onEdit, onDelete }: Props) {
  const weekend = isWeekend(day);
  const children = Array.from(new Set(events.map((e) => e.child)));

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-sm transition-shadow hover:shadow-md ${
        weekend
          ? "border-amber-200 bg-amber-50/30"
          : "border-slate-100 bg-white"
      }`}
    >
      {/* Day header */}
      <div
        className={`px-5 py-3 flex items-center justify-between ${
          weekend ? "bg-amber-50" : "bg-slate-50/80"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="text-center w-10">
            <div className="text-3xl font-black text-slate-800 leading-none">
              {format(day, "d")}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              {format(day, "MMM")}
            </div>
          </div>
          <div>
            <div className="font-semibold text-slate-700">
              {format(day, "EEEE")}
            </div>
            {weekend && (
              <span className="inline-block text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-semibold mt-0.5">
                Weekend
              </span>
            )}
          </div>
        </div>

        {/* Child dots */}
        {children.length > 0 && (
          <div className="flex items-center gap-1.5">
            {children.map((child) => (
              <div
                key={child}
                className={`w-3 h-3 rounded-full ${CHILD_COLORS[child as Child].dot}`}
                title={child}
              />
            ))}
          </div>
        )}
      </div>

      {/* Slots */}
      <div className="px-4 py-3 space-y-4">
        {SLOTS.map((slot) => {
          const slotEvents = events.filter((e) => e.slot === slot);
          return (
            <div key={slot}>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                {SLOT_LABELS[slot]}
              </div>
              <div className="space-y-2">
                {slotEvents.map((event) => (
                  <ActivityCard
                    key={event.id}
                    event={event}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
                <button
                  onClick={() => onAdd(day, slot)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 border border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl py-2.5 transition group"
                >
                  <Plus
                    size={12}
                    className="group-hover:scale-125 transition-transform"
                  />
                  Add activity
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
