"use client";

import { Search, X } from "lucide-react";

export type FilterValue =
  | "ALL_EVENTS"
  | "Venya"
  | "Sasha"
  | "Gavr"
  | "VenyaSasha"
  | "VenyaGavr"
  | "SashaGavr"
  | "All";

const OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "ALL_EVENTS", label: "Все события" },
  { value: "Venya", label: "Веня" },
  { value: "Sasha", label: "Саша" },
  { value: "Gavr", label: "Гавр" },
  { value: "VenyaSasha", label: "Веня + Саша" },
  { value: "VenyaGavr", label: "Веня + Гавр" },
  { value: "SashaGavr", label: "Саша + Гавр" },
  { value: "All", label: "Все дети" },
];

const BASE: Record<FilterValue, string> = {
  ALL_EVENTS: "bg-slate-100 text-slate-600 border border-slate-200",
  Venya: "bg-blue-50 text-blue-700 border border-blue-200",
  Sasha: "bg-purple-50 text-purple-700 border border-purple-200",
  Gavr: "bg-green-50 text-green-700 border border-green-200",
  VenyaSasha: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  VenyaGavr: "bg-teal-50 text-teal-700 border border-teal-200",
  SashaGavr: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200",
  All: "bg-slate-50 text-slate-700 border border-slate-300",
};

const ACTIVE: Record<FilterValue, string> = {
  ALL_EVENTS: "bg-slate-700 text-white border border-slate-700",
  Venya: "bg-blue-600 text-white border border-blue-600",
  Sasha: "bg-purple-600 text-white border border-purple-600",
  Gavr: "bg-green-600 text-white border border-green-600",
  VenyaSasha: "bg-indigo-600 text-white border border-indigo-600",
  VenyaGavr: "bg-teal-600 text-white border border-teal-600",
  SashaGavr: "bg-fuchsia-600 text-white border border-fuchsia-600",
  All: "bg-slate-600 text-white border border-slate-600",
};

interface Props {
  filter: FilterValue;
  search: string;
  onFilterChange: (filter: FilterValue) => void;
  onSearchChange: (search: string) => void;
}

export function FilterBar({
  filter,
  search,
  onFilterChange,
  onSearchChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex items-center gap-1.5 flex-wrap">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
              filter === option.value ? ACTIVE[option.value] : BASE[option.value]
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="relative flex-1 min-w-44">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Поиск по мероприятиям, местам..."
          className="w-full pl-8 pr-8 py-1.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />

        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
