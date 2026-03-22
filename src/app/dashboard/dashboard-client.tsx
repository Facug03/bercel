"use client";

import { Button, Card } from "@heroui/react";
import Editor from "@monaco-editor/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SessionMenu } from "@/components/session-menu";

type ProjectSummary = {
  id: number;
  slug: string;
  title: string;
  isPublished: boolean;
  updatedAt: string;
};

type DashboardClientProps = {
  initialUsername: string | null;
  initialProjects: ProjectSummary[];
  userEmail?: string;
};

const starterHtml = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mi proyecto en Bercel</title>
    <style>
      body { font-family: system-ui, sans-serif; background: #0a0a0a; color: #fff; display: grid; place-items: center; min-height: 100vh; }
      .card { border: 1px solid rgba(255,255,255,.15); padding: 24px; border-radius: 12px; background: #111; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Hola desde Bercel 👋</h1>
      <p>Tu deploy está casi ready.</p>
    </div>
  </body>
</html>`;

export function DashboardClient({
  initialUsername,
  initialProjects,
  userEmail,
}: DashboardClientProps) {
  const [username, setUsername] = useState(initialUsername ?? "");
  const [projects, setProjects] = useState(initialProjects);

  const [usernameInput, setUsernameInput] = useState(initialUsername ?? "");
  const [slug, setSlug] = useState("mi-proyecto");
  const [title, setTitle] = useState("Mi Proyecto");
  const [htmlContent, setHtmlContent] = useState(starterHtml);
  const [isPublished, setIsPublished] = useState(true);

  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const currentPath = useMemo(() => {
    if (!username || !slug) {
      return null;
    }

    return `/${username}/${slug}`;
  }, [username, slug]);

  async function refreshProjects() {
    const response = await fetch("/api/projects", { method: "GET" });
    const data = (await response.json()) as { projects?: ProjectSummary[] };
    setProjects(data.projects ?? []);
  }

  async function handleSaveUsername() {
    setMessage(null);
    setIsSavingUsername(true);

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: usernameInput }),
    });

    const data = (await response.json()) as {
      error?: string;
      profile?: { username: string };
    };

    if (!response.ok || !data.profile) {
      setMessage(data.error ?? "No se pudo guardar el username.");
      setIsSavingUsername(false);
      return;
    }

    setUsername(data.profile.username);
    setUsernameInput(data.profile.username);
    setMessage("Username guardado.");
    setIsSavingUsername(false);
  }

  async function handleSaveProject() {
    setMessage(null);
    setIsSavingProject(true);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        title,
        htmlContent,
        isPublished,
      }),
    });

    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      setMessage(data.error ?? "No se pudo guardar el proyecto.");
      setIsSavingProject(false);
      return;
    }

    await refreshProjects();
    setMessage("Proyecto guardado correctamente.");
    setIsSavingProject(false);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-8 text-white">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Tus proyectos
          </h1>
          <p className="text-sm text-white/60">
            {userEmail ? `Sesión: ${userEmail}` : "Sesión iniciada"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            className="text-sm text-white/70 underline underline-offset-4"
            href="/"
          >
            Volver al inicio
          </Link>
          <SessionMenu showDashboardLink={false} />
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card
          className="border border-white/10 bg-[#111]/90 p-5 lg:col-span-4"
          variant="default"
        >
          <Card.Header className="p-0 pb-4">
            <h2 className="text-lg font-semibold">Ruta pública</h2>
          </Card.Header>
          <Card.Content className="space-y-3 p-0">
            <label className="block space-y-1">
              <span className="text-sm text-white/70">
                Username (requerido)
              </span>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none transition focus:border-white/30"
                onChange={(event) => setUsernameInput(event.target.value)}
                placeholder="tu-username"
                value={usernameInput}
              />
            </label>

            <Button
              className="w-full rounded-xl border border-white/20 text-white"
              isDisabled={isSavingUsername}
              onPress={handleSaveUsername}
              variant="outline"
            >
              {isSavingUsername ? "Guardando..." : "Guardar username"}
            </Button>

            <p className="text-sm text-white/55">
              Tu base URL será:
              <span className="ml-1 rounded bg-white/10 px-2 py-0.5 font-mono text-white">
                /{username || "tu-username"}
              </span>
            </p>

            {message ? (
              <p className="text-sm text-white/70">{message}</p>
            ) : null}
          </Card.Content>
        </Card>

        <Card
          className="border border-white/10 bg-[#111]/90 p-5 lg:col-span-8"
          variant="default"
        >
          <Card.Header className="flex items-center justify-between p-0 pb-4">
            <div>
              <h2 className="text-lg font-semibold">
                Crear/actualizar proyecto
              </h2>
              <p className="text-sm text-white/60">
                Guarda por slug en la ruta /[username]/[project].
              </p>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-white/70">
              <input
                checked={isPublished}
                onChange={(event) => setIsPublished(event.target.checked)}
                type="checkbox"
              />
              Publicado
            </label>
          </Card.Header>

          <Card.Content className="space-y-4 p-0">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm text-white/70">Slug del proyecto</span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none transition focus:border-white/30"
                  onChange={(event) =>
                    setSlug(event.target.value.toLowerCase())
                  }
                  placeholder="mi-proyecto"
                  value={slug}
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm text-white/70">Título</span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none transition focus:border-white/30"
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Landing de prueba"
                  value={title}
                />
              </label>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10">
              <Editor
                defaultLanguage="html"
                height="360px"
                onChange={(value) => setHtmlContent(value ?? "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  smoothScrolling: true,
                  scrollBeyondLastLine: false,
                }}
                theme="vs-dark"
                value={htmlContent}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                className="rounded-xl bg-white font-semibold text-black"
                isDisabled={isSavingProject || !username}
                onPress={handleSaveProject}
                variant="primary"
              >
                {isSavingProject ? "Guardando..." : "Guardar proyecto"}
              </Button>

              {currentPath ? (
                <Link
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
                  href={currentPath}
                  target="_blank"
                >
                  Abrir {currentPath}
                </Link>
              ) : null}
            </div>
          </Card.Content>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card
          className="border border-white/10 bg-[#111]/90 p-5 lg:col-span-6"
          variant="default"
        >
          <Card.Header className="p-0 pb-3">
            <h3 className="text-lg font-semibold">Preview</h3>
          </Card.Header>
          <Card.Content className="p-0">
            <iframe
              className="h-105 w-full rounded-xl border border-white/10 bg-white"
              sandbox="allow-scripts"
              srcDoc={htmlContent}
              title="Preview HTML"
            />
          </Card.Content>
        </Card>

        <Card
          className="border border-white/10 bg-[#111]/90 p-5 lg:col-span-6"
          variant="default"
        >
          <Card.Header className="p-0 pb-3">
            <h3 className="text-lg font-semibold">
              Tus proyectos ({projects.length})
            </h3>
          </Card.Header>
          <Card.Content className="space-y-3 p-0">
            {projects.length === 0 ? (
              <p className="text-sm text-white/60">
                Todavía no creaste proyectos.
              </p>
            ) : (
              projects.map((project) => {
                const path = username ? `/${username}/${project.slug}` : null;

                return (
                  <article
                    className="rounded-xl border border-white/10 bg-white/5 p-3"
                    key={project.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="font-mono text-xs text-white/60">
                          /{project.slug}
                        </p>
                      </div>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/70">
                        {project.isPublished ? "Publicado" : "Borrador"}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-white/50">
                      Actualizado:{" "}
                      {new Date(project.updatedAt).toLocaleString()}
                    </p>

                    {path ? (
                      <Link
                        className="mt-2 inline-block text-sm text-white underline underline-offset-4"
                        href={path}
                        target="_blank"
                      >
                        Abrir URL
                      </Link>
                    ) : null}
                  </article>
                );
              })
            )}
          </Card.Content>
        </Card>
      </section>
    </main>
  );
}
