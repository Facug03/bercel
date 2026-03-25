-- Analíticas: última visita por proyecto + visitas diarias

BEGIN;

ALTER TABLE public.project
  ADD COLUMN IF NOT EXISTS last_visited_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS public.project_daily_views (
  project_id BIGINT NOT NULL REFERENCES public.project(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  views BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (project_id, visit_date)
);

CREATE INDEX IF NOT EXISTS project_daily_views_project_date_idx
  ON public.project_daily_views (project_id, visit_date DESC);

COMMIT;
