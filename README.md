# Bercel

**Bercel** es una plataforma donde los desarrolladores pueden crear y compartir proyectos web directamente desde el navegador, con un editor de código integrado y previsualización en tiempo real. Pensado como una alternativa simple y rápida para publicar demos, experimentos y proyectos personales.

> ⚠️ **Esto es una parodia.** El nombre es un chiste con [Vercel](https://vercel.com) — plataforma que yo mismo uso y recomiendo.

🔗 **Demo en vivo:** [bercel.dev](https://bercel.dev)

> Proyecto desarrollado para la [Hackathon CubePath 2026](https://github.com/midudev/hackaton-cubepath-2026), desplegado íntegramente en [CubePath](https://midu.link/cubepath).

<img width="1000" height="1000" alt="MockupViews_1x_PNG_20260329_148" src="https://github.com/user-attachments/assets/f1284fcc-1c2b-4265-a223-44a0c04b30d6" />

---

## ¿Cómo se usa CubePath?

La aplicación y la base de datos PostgreSQL están desplegadas en una VPS de **CubePath** usando **Dokploy** como plataforma de despliegue. CubePath provee la infraestructura (VPS) y Dokploy gestiona los contenedores y variables de entorno.

---

## Stack

- **Next.js 16** — framework principal (app router)
- **Better Auth** — autenticación (email/contraseña + GitHub OAuth)
- **PostgreSQL** — base de datos (hosteada en CubePath via Dokploy)
- **HeroUI + Tailwind CSS** — UI
- **Monaco Editor** — editor de código en el navegador
- **OpenAI / OpenRouter** — IA integrada

---

## Ejecutar localmente

### Requisitos

- [Bun](https://bun.sh) instalado
- PostgreSQL accesible

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/Facug03/bercel
cd bercel
bun install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Completá el `.env`:

```env
BETTER_AUTH_SECRET=        # string aleatorio seguro
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=              # postgresql://user:password@host:5432/dbname
GITHUB_CLIENT_ID=          # opcional, para login con GitHub
GITHUB_CLIENT_SECRET=      # opcional
OPENROUTER_API_KEY=        # opcional, para funciones de IA
```

### 3. Correr migraciones

```bash
# Tablas de Better Auth
bun run db:migrate

# Tablas de la app
psql "$DATABASE_URL" -f db/migrations/001_app_schema.sql
psql "$DATABASE_URL" -f db/migrations/002_add_views.sql
psql "$DATABASE_URL" -f db/migrations/003_analytics.sql
```

### 4. Iniciar el servidor

```bash
bun run dev
```

La app estará disponible en [http://localhost:3000](http://localhost:3000).

---
