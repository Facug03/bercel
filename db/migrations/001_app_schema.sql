-- Bercel app schema (independiente de las tablas core de Better Auth)
-- Requiere que ya exista la tabla "user" creada por Better Auth.

BEGIN;

-- Cada usuario debe tener un username único para construir rutas /[username]/[project]
CREATE TABLE IF NOT EXISTS public.user_profile (
  user_id TEXT PRIMARY KEY REFERENCES public."user"(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_profile_username_format CHECK (username ~ '^[a-zA-Z0-9_-]{3,32}$')
);

-- Username único case-insensitive
CREATE UNIQUE INDEX IF NOT EXISTS user_profile_username_unique_idx
  ON public.user_profile (LOWER(username));

-- Proyectos del usuario (por ahora ilimitados)
CREATE TABLE IF NOT EXISTS public.project (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  html_content TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT project_slug_format CHECK (slug ~ '^[a-z0-9-]{1,64}$')
);

-- Un slug por usuario (permite /[username]/[project])
CREATE UNIQUE INDEX IF NOT EXISTS project_user_slug_unique_idx
  ON public.project (user_id, LOWER(slug));

-- Ayuda para listado de dashboard
CREATE INDEX IF NOT EXISTS project_user_created_at_idx
  ON public.project (user_id, created_at DESC);

COMMIT;
