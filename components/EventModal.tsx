"use client";
import { useState } from "react";
import {
  CalendarEvent,
  Child,
  EventType,
  EventSlot,
  EVENT_TYPES,
  TRANSPORT_OPTIONS,
} from "@/lib/types";
import { X } from "lucide-react";
import { format } from "date-fns";

const CHILDREN: Child[] = ["Venya", "Sasha", "Gavr"];
const SLOTS: { value: EventSlot; label: string }[] = [
  { value: "daytime", label: "Daytime Camp / Main Activity" },
  { value: "after-camp", label: "After-Camp Activity" },
  { value: "evening", label: "Evening Event" },
];

interface Props {
  event?: CalendarEvent | null;
  defaultDate?: Date;
  defaultSlot?: EventSlot;
  onSave: (data: Partial<CalendarEvent>) => Promise<void>;
  onClose: () => void;
}

export function EventModal({
  event,
  defaultDate,
  defaultSlot,
  onSave,
  onClose,
}: Props) {
  const dateStr = defaultDate
    ? format(defaultDate, "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");

  const [form, setForm] = useState({
    child: (event?.child ?? "Venya") as Child,
    title: event?.title ?? "",
    start_date: event?.start_date ?? dateStr,
    end_date: event?.end_date ?? dateStr,
    start_time: event?.start_time ?? "09:00",
    end_time: event?.end_time ?? "18:00",
    location: event?.location ?? "",
    drop_off: event?.drop_off ?? "TBD",
    pick_up: event?.pick_up ?? "TBD",
    notes: event?.notes ?? "",
    type: (event?.type ?? "Camp") as EventType,
    slot: (event?.slot ?? defaultSlot ?? "daytime") as EventSlot,
  });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-lg font-bold text-slate-800">
            {event ? "Edit Activity" : "Add Activity"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-500"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Child + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Child
              </label>
              <select
                value={form.child}
                onChange={(e) => set("child", e.target.value as Child)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {CHILDREN.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value as EventType)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Activity title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="e.g. Minecraft Portal, Dance Class..."
            />
          </div>

          {/* Slot */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Schedule slot
            </label>
            <select
              value={form.slot}
              onChange={(e) => set("slot", e.target.value as EventSlot)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {SLOTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Start date
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => set("start_date", e.target.value)}
                min="2025-06-22"
                max="2025-07-20"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                End date
              </label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => set("end_date", e.target.value)}
                min={form.start_date}
                max="2025-07-20"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Start time
              </label>
              <input
                type="time"
                value={form.start_time}
                onChange={(e) => set("start_time", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                End time
              </label>
              <input
                type="time"
                value={form.end_time}
                onChange={(e) => set("end_time", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="School, address, online..."
            />
          </div>

          {/* Transport */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Drop-off
              </label>
              <select
                value={form.drop_off}
                onChange={(e) => set("drop_off", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {TRANSPORT_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Pick-up
              </label>
              <select
                value={form.pick_up}
                onChange={(e) => set("pick_up", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {TRANSPORT_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              placeholder="Any extra info..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 font-medium py-2.5 rounded-xl hover:bg-slate-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition text-sm disabled:opacity-60"
            >
              {saving ? "Saving…" : event ? "Save Changes" : "Add Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
