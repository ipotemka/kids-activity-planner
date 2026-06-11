import { eachDayOfInterval } from "date-fns";

export const PLANNER_START = new Date(2026, 5, 22); // June 22, 2026
export const PLANNER_END   = new Date(2026, 6, 20); // July 20, 2026

export function getAllDays(): Date[] {
  return eachDayOfInterval({ start: PLANNER_START, end: PLANNER_END });
}

export function groupByWeek(days: Date[]): Date[][] {
  const weeks: Date[][] = [];
  let current: Date[] = [];
  days.forEach((day) => {
    current.push(day);
    if (day.getDay() === 0) {
      weeks.push(current);
      current = [];
    }
  });
  if (current.length > 0) weeks.push(current);
  return weeks;
}

// Parses "yyyy-MM-dd" directly into local midnight.
// parseISO() returns UTC midnight, which shifts the date by one day in UTC-
// timezones (US, Americas). Using local constructor avoids that shift entirely.
function localDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isEventOnDay(
  event: { start_date: string; end_date: string },
  day: Date
): boolean {
  const start = localDate(event.start_date);
  const end   = localDate(event.end_date);
  const d     = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  return d >= start && d <= end;
}
