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
    : "2026-06-22";

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

const [extraDates, setExtraDates] = useState<string[]>([]);

function set<K extends keyof typeof form>(
  key: K,
  value: (typeof form)[K]
) {
  setForm((f) => ({ ...f, [key]: value }));
}

function addExtraDate() {
  setExtraDates((dates) => [...dates, form.start_date]);
}

function updateExtraDate(index: number, value: string) {
  setExtraDates((dates) =>
    dates.map((date, i) => (i === index ? value : date))
  );
}

function removeExtraDate(index: number) {
  setExtraDates((dates) => dates.filter((_, i) => i !== index));
}

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setSaving(true);

  const datesToSave = [form.start_date, ...extraDates].filter(
    (date, index, arr) => date && arr.indexOf(date) === index
  );

  await Promise.all(
    datesToSave.map((date) =>
      onSave({
        ...form,
        start_date: date,
        end_date: date,
      })
    )
  );

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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Ребёнок
              </label>
              <select
                value={form.child}
                onChange={(e) => set("child", e.target.value as Child)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="Venya">Веня</option>
                <option value="Sasha">Саша</option>
                <option value="Gavr">Гавр</option>
                <option value="SashaVenya">Саша + Веня</option>
                <option value="All">Все дети</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Тип
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

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Название *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Например: лагерь, танцы, скейтбординг..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Дата начала
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => set("start_date", e.target.value)}
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
                onChange={(e) => set("end_date", e.target.value)}
                min={form.start_date}
                max="2026-07-20"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                <div className="space-y-2">
  {extraDates.map((date, index) => (
    <div key={index} className="flex gap-2 items-center">
      <input
        type="date"
        value={date}
        onChange={(e) => updateExtraDate(index, e.target.value)}
        min="2026-06-22"
        max="2026-07-20"
        className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <button
        type="button"
        onClick={() => removeExtraDate(index)}
        className="text-red-500 hover:text-red-700 text-sm"
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
                Время начала
              </label>
              <input
                type="time"
                value={form.start_time}
                onChange={(e) => set("start_time", e.target.value)}
                step="60"
                lang="ru-RU"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
/>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Время окончания
              </label>
            <input
  type="time"
  value={form.end_time}
  onChange={(e) => set("end_time", e.target.value)}
  step="60"
  lang="ru-RU"
  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
/>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Место / адрес
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Школа, адрес, название места..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Кто забирает
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

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Комментарий
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              placeholder="Любая дополнительная информация..."
            />
          </div>

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
              {saving
                ? "Сохраняю..."
                : event
                ? "Сохранить"
                : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
