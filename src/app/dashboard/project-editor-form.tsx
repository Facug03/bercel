"use client";

import { Button, Card } from "@heroui/react";
import Editor from "@monaco-editor/react";
import Link from "next/link";
import { useMemo, useState } from "react";

type ProjectEditorFormProps = {
  mode: "create" | "edit";
  username: string;
  initialSlug: string;
  initialTitle: string;
  initialHtmlContent: string;
  initialIsPublished: boolean;
};

export const starterHtml = `<!doctype html>
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

export function ProjectEditorForm({
  mode,
  username,
  initialSlug,
  initialTitle,
  initialHtmlContent,
  initialIsPublished,
}: ProjectEditorFormProps) {
  const [slug, setSlug] = useState(initialSlug);
  const [title, setTitle] = useState(initialTitle);
  const [htmlContent, setHtmlContent] = useState(initialHtmlContent);
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const currentPath = useMemo(() => {
    if (!username || !slug) {
      return null;
    }

    return `/${username}/${slug}`;
  }, [username, slug]);

  async function handleSaveProject() {
    setMessage(null);
    setIsSaving(true);

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

    const data = (await response.json()) as {
      error?: string;
      project?: { slug: string };
    };

    if (!response.ok) {
      setMessage(data.error ?? "No se pudo guardar el proyecto.");
      setIsSaving(false);
      return;
    }

    setMessage(
      mode === "create"
        ? "Proyecto creado correctamente."
        : "Proyecto actualizado correctamente.",
    );

    setIsSaving(false);

    if (mode === "create" && data.project?.slug) {
      window.location.href = `/dashboard/projects/${data.project.slug}`;
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-12">
      <Card
        className="border border-white/10 bg-[#111]/90 p-5 lg:col-span-8"
        variant="default"
      >
        <Card.Header className="flex items-center justify-between p-0 pb-4">
          <div>
            <h2 className="text-lg font-semibold">
              {mode === "create" ? "Crear proyecto" : "Editar proyecto"}
            </h2>
            <p className="text-sm text-white/60">
              Publicá en la ruta /[username]/[project].
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
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={mode === "edit"}
                onChange={(event) => setSlug(event.target.value.toLowerCase())}
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
              height="420px"
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
              isDisabled={isSaving}
              onPress={handleSaveProject}
              variant="primary"
            >
              {isSaving
                ? "Guardando..."
                : mode === "create"
                  ? "Crear"
                  : "Guardar cambios"}
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

            <Link
              className="text-sm text-white/70 underline underline-offset-4"
              href="/dashboard"
            >
              Volver al dashboard
            </Link>
          </div>

          {message ? <p className="text-sm text-white/70">{message}</p> : null}
        </Card.Content>
      </Card>

      <Card
        className="border border-white/10 bg-[#111]/90 p-5 lg:col-span-4"
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
    </section>
  );
}
