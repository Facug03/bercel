# DB migrations (app)

Orden recomendado:

1. Correr tablas de Better Auth.
2. Correr migraciones de app en `db/migrations`.

Primero:

- `bun run db:migrate`

Después aplicá:

- `db/migrations/001_app_schema.sql`

Esta migración agrega:

- `user_profile` (username único por usuario)
- `project` (proyectos por usuario con slug único por usuario)
