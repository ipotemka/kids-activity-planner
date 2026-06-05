"use client";
import { Child } from "@/lib/types";
import { Search, X } from "lucide-react";

type FilterChild = Child | "All";
const OPTIONS: FilterChild[] = ["All", "Venya", "Sasha", "Gavr"];

const BASE: Record<FilterChild, string> = {
  All: "bg-slate-100 text-slate-600 border border-slate-200",
  Venya: "bg-blue-50 text-blue-700 border border-blue-200",
  Sasha: "bg-purple-50 text-purple-700 border border-purple-200",
  Gavr: "bg-green-50 text-green-700 border border-green-200",
};
const ACTIVE: Record<FilterChild, string> = {
  All: "bg-slate-700 text-white border border-slate-700",
  Venya: "bg-blue-600 text-white border border-blue-600",
  Sasha: "bg-purple-600 text-white border border-purple-600",
  Gavr: "bg-green-600 text-white border border-green-600",
};

interface Props {
  filter: FilterChild;
  search: string;
  onFilterChange: (f: FilterChild) => void;
  onSearchChange: (s: string) => void;
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
        {OPTIONS.map((c) => (
          <button
            key={c}
            onClick={() => onFilterChange(c)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${
              filter === c ? ACTIVE[c] : BASE[c]
            }`}
          >
            {c}
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
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search activities, locations…"
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
