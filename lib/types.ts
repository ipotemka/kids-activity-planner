export type Child = "Venya" | "Sasha" | "Gavr" | "All" | "SashaVenya";
export type EventSlot = "daytime" | "after-camp" | "evening";
export type EventType =
  | "Лагерь"
  | "Занятие"
  | "Спорт"
  | "Творчество"
  | "Мастер-класс"
  | "Выступление"
  | "Театр"
  | "Музей"
  | "Вечернее мероприятие"
  | "Другое";
export type UserRole = "Admin" | "Parent" | "Family Member";

export interface CalendarEvent {
  id: string;
  child: Child;
  title: string;
  start_date: string;
  end_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  drop_off: string;
  pick_up: string;
  notes: string | null;
  type: EventType;
  slot: EventSlot;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export const CHILD_COLORS: Record<
  Child,
  { bg: string; text: string; border: string; light: string; badge: string; dot: string }
> = {
  Venya: {
    bg: "bg-blue-500",
    text: "text-blue-700",
    border: "border-blue-300",
    light: "bg-blue-50",
    badge: "bg-blue-100 text-blue-800",
    dot: "bg-blue-500",
  },
  Sasha: {
    bg: "bg-purple-500",
    text: "text-purple-700",
    border: "border-purple-300",
    light: "bg-purple-50",
    badge: "bg-purple-100 text-purple-800",
    dot: "bg-purple-500",
  },
  Gavr: {
    bg: "bg-green-500",
    text: "text-green-700",
    border: "border-green-300",
    light: "bg-green-50",
    badge: "bg-green-100 text-green-800",
    dot: "bg-green-500",
  },
   All: {
  bg: "bg-amber-500",
  text: "text-amber-700",
  border: "border-amber-300",
  light: "bg-amber-50",
  badge: "bg-amber-100 text-amber-800",
  dot: "bg-amber-500",
},
    SashaVenya: {
    bg: "bg-indigo-500",
    text: "text-indigo-700",
    border: "border-indigo-300",
    light: "bg-indigo-50",
    badge: "bg-indigo-100 text-indigo-800",
    dot: "bg-indigo-500",
  },
};

export const TRANSPORT_OPTIONS = [
  "Ира",
  "Дима",
  "Ира+Дима на машине",
  "Марина",
  "Лариса",
  "Марина+Лариса",
];

export const EVENT_TYPES: EventType[] = [
  "Лагерь",
  "Занятие",
  "Спорт",
  "Творчество",
  "Мастер-класс",
  "Выступление",
  "Театр",
  "Музей",
  "Вечернее мероприятие",
  "Другое",
];

export const SLOT_LABELS: Record<EventSlot, string> = {
  daytime: "День",
  "after-camp": "После лагеря",
  evening: "Вечер",
};
