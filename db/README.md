# DB migrations (app)

Orden recomendado:

1. Correr tablas de Better Auth.
2. Correr migraciones de app en `db/migrations`.

Primero:

- `bun run db:migrate`

Después aplicá las migraciones en orden:

```bash
psql "$DATABASE_URL" -f db/migrations/001_app_schema.sql
psql "$DATABASE_URL" -f db/migrations/002_add_views.sql
psql "$DATABASE_URL" -f db/migrations/003_analytics.sql
```

### Migraciones

| Archivo | Descripción |
|---|---|
| `001_app_schema.sql` | `user_profile` (username único) + `project` (proyectos con slug único por usuario) |
| `002_add_views.sql` | Columna `views BIGINT` en `project` para contar visitas |
| `003_analytics.sql` | Columna `last_visited_at` en `project` + tabla `project_daily_views` para analíticas diarias |
