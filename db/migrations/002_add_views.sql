-- Agrega contador de visitas a cada proyecto

BEGIN;

ALTER TABLE public.project
  ADD COLUMN IF NOT EXISTS views BIGINT NOT NULL DEFAULT 0;

COMMIT;
