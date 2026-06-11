import { Child, CHILD_COLORS, CHILD_DISPLAY_NAMES } from "@/lib/types";

export function ChildBadge({ child }: { child: Child }) {
  const c = CHILD_COLORS[child];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${c.badge}`}>
      {CHILD_DISPLAY_NAMES[child]}
    </span>
  );
}
