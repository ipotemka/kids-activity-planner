-- ============================================================
-- Family Summer Planner — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles (extends auth.users) ──────────────────────────
CREATE TABLE public.profiles (
  id        UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name      TEXT NOT NULL,
  email     TEXT NOT NULL,
  role      TEXT NOT NULL DEFAULT 'Family Member'
              CHECK (role IN ('Admin', 'Parent', 'Family Member')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Events ─────────────────────────────────────────────────
CREATE TABLE public.events (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  child       TEXT NOT NULL CHECK (child IN ('Venya', 'Sasha', 'Gavr')),
  title       TEXT NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  start_time  TIME,
  end_time    TIME,
  location    TEXT,
  drop_off    TEXT NOT NULL DEFAULT 'Не назначено',
  pick_up     TEXT NOT NULL DEFAULT 'Не назначено',
  notes       TEXT,
  type        TEXT NOT NULL DEFAULT 'Camp'
                CHECK (type IN ('Camp','Class','Sports','Arts','Workshop','Performance','Evening Event','Other')),
  slot        TEXT NOT NULL DEFAULT 'daytime'
                CHECK (slot IN ('daytime','after-camp','evening')),
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tasks ──────────────────────────────────────────────────
CREATE TABLE public.tasks (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT NOT NULL,
  completed   BOOLEAN NOT NULL DEFAULT FALSE,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── updated_at trigger ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ── Row-Level Security ─────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks    ENABLE ROW LEVEL SECURITY;

-- Profiles: authenticated users only
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Events: open access via anon key (no login required)
CREATE POLICY "events_select" ON public.events FOR SELECT TO anon USING (true);
CREATE POLICY "events_insert" ON public.events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "events_update" ON public.events FOR UPDATE TO anon USING (true);
CREATE POLICY "events_delete" ON public.events FOR DELETE TO anon USING (true);

-- Tasks: open access via anon key (no login required)
CREATE POLICY "tasks_select" ON public.tasks FOR SELECT TO anon USING (true);
CREATE POLICY "tasks_insert" ON public.tasks FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "tasks_update" ON public.tasks FOR UPDATE TO anon USING (true);
CREATE POLICY "tasks_delete" ON public.tasks FOR DELETE TO anon USING (true);

-- ── Seed: confirmed activities (2026) ──────────────────────
INSERT INTO public.events
  (child, title, start_date, end_date, start_time, end_time, location, drop_off, pick_up, type, slot)
VALUES
  ('Venya', 'Minecraft Portal',
   '2026-06-29', '2026-07-03', '09:00', '18:00', 'New School', 'Не назначено', 'Не назначено', 'Camp', 'daytime'),

  ('Venya', 'Skateboarding',
   '2026-07-06', '2026-07-10', '09:00', '18:00', 'New School', 'Не назначено', 'Не назначено', 'Sports', 'daytime'),

  ('Sasha', 'Contemporary Dance',
   '2026-06-29', '2026-07-03', '09:00', '18:00', 'New School', 'Не назначено', 'Не назначено', 'Arts', 'daytime'),

  ('Sasha', 'Contemporary Animation: Imagining the Future',
   '2026-07-06', '2026-07-10', '09:00', '18:00', 'New School', 'Не назначено', 'Не назначено', 'Arts', 'daytime');

-- ── Seed: family task checklist ───────────────────────────
INSERT INTO public.tasks (title, completed) VALUES
  ('Купить всё для лагеря',              false),
  ('Проверить адреса мероприятий',       false),
  ('Назначить отвозит/забирает',         false),
  ('Добавить вечерние мероприятия',      false),
  ('Подтвердить расписание Гавра',       false),
  ('Собрать рюкзаки на первую неделю',   false);
