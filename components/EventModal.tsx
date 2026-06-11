"use client";

import { useState } from "react";
import {
  CalendarEvent,
  Child,
  EventType,
  EventSlot,
  EVENT_TYPES,
  EVENT_TYPE_LABELS,
  TRANSPORT_OPTIONS,
  SLOT_LABELS,
  CHILD_DISPLAY_NAMES,
} from "@/lib/types";
import { X } from "lucide-react";
import { format } from "date-fns";

const CHILDREN: Child[] = [
  "Venya",
  "Sasha",
  "Gavr",
  "All",
  "SashaVenya",
  "Ira",
  "Dima",
];
// 00:00 → 23:45 in 15-minute steps.
// We use <select> instead of <input type="time"> because browsers render
// type="time" in AM/PM format on en-US / Apple locales with no HTML override.
const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    TIME_OPTIONS.push(
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    );
  }
}

// If the DB has an odd time (e.g. "09:07"), include it so the value is
// never silently dropped when editing an existing event.
function timeOptions(current: string): string[] {
  const v = current.slice(0, 5);
  return TIME_OPTIONS.includes(v) ? TIME_OPTIONS : [...TIME_OPTIONS, v].sort();
}

interface Props {
  event?: CalendarEvent | null;
  defaultDate?: Date;
  defaultSlot?: EventSlot;
  onSave: (data: Partial<CalendarEvent>[]) => Promise<void>;
  onClose: () => void;
}

export function EventModal({ event, defaultDate, defaultSlot, onSave, onClose }: Props) {
  const dateStr = defaultDate ? format(defaultDate, "yyyy-MM-dd") : "2026-06-22";

  const [form, setForm] = useState({
    child:      (event?.child      ?? "Venya") as Child,
    title:       event?.title      ?? "",
    start_date:  event?.start_date ?? dateStr,
    end_date:    event?.end_date   ?? dateStr,
    // .slice(0,5) normalises "09:00:00" (Postgres TIME format) → "09:00" (select value)
    start_time: (event?.start_time ?? "09:00").slice(0, 5),
    end_time:   (event?.end_time   ?? "18:00").slice(0, 5),
    location:    event?.location   ?? "",
    drop_off:    event?.drop_off   ?? TRANSPORT_OPTIONS[0],
    pick_up:     event?.pick_up    ?? TRANSPORT_OPTIONS[0],
    notes:       event?.notes      ?? "",
    type:       (event?.type       ?? "Camp") as EventType,
    slot:       (event?.slot       ?? defaultSlot ?? "daytime") as EventSlot,
  });

  const [extraDates, setExtraDates] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addExtraDate() {
    setExtraDates((d) => [...d, form.start_date]);
  }
  function updateExtraDate(i: number, value: string) {
    setExtraDates((d) => d.map((v, idx) => (idx === i ? value : v)));
  }
  function removeExtraDate(i: number) {
    setExtraDates((d) => d.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const base: Partial<CalendarEvent> = {
      ...form,
      start_time: form.start_time || null,
      end_time:   form.end_time   || null,
      location:   form.location.trim()  || null,
      notes:      form.notes.trim()     || null,
    };

    let eventsToSave: Partial<CalendarEvent>[];

    if (event) {
      // Edit: always a single record
      eventsToSave = [base];
    } else if (extraDates.length > 0) {
      // Repeating: one separate single-day record per date.
      // end_date = start_date for each; form.end_date is ignored in this mode.
      const uniqueDates = Array.from(
        new Set([form.start_date, ...extraDates])
      ).filter(Boolean);
      eventsToSave = uniqueDates.map((date) => ({
        ...base,
        start_date: date,
        end_date:   date,
      }));
    } else {
      // Single day OR multi-day span — end_date preserved from form as-is
      eventsToSave = [base];
    }

    await onSave(eventsToSave);
    setSaving(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-lg font-bold text-slate-800">
            {event ? "Редактировать мероприятие" : "Добавить мероприятие"}
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
                Ребёнок
              </label>
              <select
                value={form.child}
                onChange={(e) => setField("child", e.target.value as Child)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {CHILDREN.map((c) => (
                  <option key={c} value={c}>{CHILD_DISPLAY_NAMES[c]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Тип
              </label>
              <select
                value={form.type}
                onChange={(e) => setField("type", e.target.value as EventType)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>{EVENT_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Название *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Например: лагерь, танцы, скейтбординг..."
            />
          </div>

          {/* Slot */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Слот
            </label>
            <select
              value={form.slot}
              onChange={(e) => setField("slot", e.target.value as EventSlot)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {(Object.entries(SLOT_LABELS) as [EventSlot, string][]).map(([v, label]) => (
                <option key={v} value={v}>{label}</option>
              ))}
            </select>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Дата начала
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setField("start_date", e.target.value)}
                min="2026-06-22"
                max="2026-07-20"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Дата окончания
              </label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setField("end_date", e.target.value)}
                min={form.start_date}
                max="2026-07-20"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Repeating dates — add mode only, outside any <label> element */}
          {!event && (
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">
                Повторяющиеся даты{" "}
                <span className="font-normal text-slate-400">(необязательно)</span>
              </p>

              <div className="space-y-2">
                {extraDates.map((date, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => updateExtraDate(i, e.target.value)}
                      min="2026-06-22"
                      max="2026-07-20"
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeExtraDate(i)}
                      className="text-red-400 hover:text-red-600 text-sm px-2 shrink-0"
                    >
                      Удалить
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addExtraDate}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Добавить ещё дату
                </button>
              </div>

              {extraDates.length > 0 && (
                <p className="text-xs text-slate-400 mt-1">
                  Будет создано {1 + extraDates.length} отдельных записей. Дата окончания игнорируется.
                </p>
              )}
            </div>
          )}

          {/* Times — <select> with HH:mm strings; no browser AM/PM rendering possible */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Время начала
              </label>
              <select
                value={form.start_time}
                onChange={(e) => setField("start_time", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {timeOptions(form.start_time).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Время окончания
              </label>
              <select
                value={form.end_time}
                onChange={(e) => setField("end_time", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {timeOptions(form.end_time).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Место / адрес
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Школа, адрес, название места..."
            />
          </div>

          {/* Transport */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Кто отвозит
              </label>
              <select
                value={form.drop_off}
                onChange={(e) => setField("drop_off", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {TRANSPORT_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Кто забирает
              </label>
              <select
                value={form.pick_up}
                onChange={(e) => setField("pick_up", e.target.value)}
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
              Комментарий
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              placeholder="Любая дополнительная информация..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 font-medium py-2.5 rounded-xl hover:bg-slate-50 transition text-sm"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition text-sm disabled:opacity-60"
            >
              {saving ? "Сохраняю..." : event ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
