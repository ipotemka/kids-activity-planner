import { eachDayOfInterval, parseISO } from "date-fns";

export const PLANNER_START = new Date(2025, 5, 22); // June 22
export const PLANNER_END = new Date(2025, 6, 20);   // July 20

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

export function isEventOnDay(
  event: { start_date: string; end_date: string },
  day: Date
): boolean {
  const s = parseISO(event.start_date);
  const e = parseISO(event.end_date);
  const d = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  const start = new Date(s.getFullYear(), s.getMonth(), s.getDate());
  const end = new Date(e.getFullYear(), e.getMonth(), e.getDate());
  return d >= start && d <= end;
}
