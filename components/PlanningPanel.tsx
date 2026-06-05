import { Car, Info } from "lucide-react";
import { TRANSPORT_OPTIONS } from "@/lib/types";

const NOTES = [
  { icon: "🏫", text: "New School — 23 W 97th St, New York" },
  { icon: "⏰", text: "Camp hours: 9:00 AM – 6:00 PM" },
  { icon: "📋", text: "Assign drop-off & pick-up before June 22" },
  { icon: "📦", text: "Camp supply list due by June 20" },
  { icon: "✅", text: "Confirm Gavr's schedule ASAP" },
];

export function PlanningPanel() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <Info size={17} className="text-slate-500" />
        <h2 className="font-bold text-slate-800">Planning Notes</h2>
      </div>

      {/* Notes */}
      <div className="px-4 py-3 space-y-2">
        {NOTES.map((note, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50"
          >
            <span className="text-base leading-tight shrink-0">{note.icon}</span>
            <p className="text-sm text-slate-600 leading-snug">{note.text}</p>
          </div>
        ))}
      </div>

      {/* Transport */}
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <Car size={15} className="text-slate-500" />
          <h3 className="font-semibold text-slate-700 text-sm">
            Transport roster
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRANSPORT_OPTIONS.filter((o) => o !== "TBD").map((person) => (
            <span
              key={person}
              className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium"
            >
              {person}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
