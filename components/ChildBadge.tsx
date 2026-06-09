import { Child, CHILD_COLORS } from "@/lib/types";

const LABELS: Record<Child, string> = {
  Venya: "Веня",
  Sasha: "Саша",
  Gavr: "Гавр",
  SashaVenya: "САША + ВЕНЯ",
  All: "Все дети",
};

export function ChildBadge({ child }: { child: Child }) {
  const c = CHILD_COLORS[child];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${c.badge}`}
    >
      {LABELS[child]}
    </span>
  );
}
