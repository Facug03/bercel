"use client";

import Editor from "@monaco-editor/react";
import { ExternalLink, Maximize2, Minimize2, Save } from "lucide-react";
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
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);

  const currentPath = useMemo(() => {
    if (!username || !slug) return null;
    return `/${username}/${slug}`;
  }, [username, slug]);

  async function handleSaveProject() {
    setMessage(null);
    setIsSaving(true);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title, htmlContent, isPublished }),
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

    setMessage(mode === "create" ? "Proyecto creado." : "Guardado.");
    setIsSaving(false);

    if (mode === "create" && data.project?.slug) {
      window.location.href = `/dashboard/projects/${data.project.slug}`;
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-[#0d0d0d] px-4 py-2">
        <Link
          className="shrink-0 text-xs text-white/35 transition hover:text-white/65"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <span className="text-white/20">/</span>
        <span className="shrink-0 text-xs text-white/40">
          {mode === "create" ? "Nuevo proyecto" : slug}
        </span>

        <div className="flex flex-1 items-center justify-center gap-2">
          {mode === "create" && (
            <input
              className="w-32 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none transition placeholder:text-white/30 focus:border-white/25"
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              placeholder="slug"
              value={slug}
            />
          )}
          <input
            className="w-48 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none transition placeholder:text-white/30 focus:border-white/25"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            value={title}
          />
        </div>

        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-white/45 transition hover:text-white/65 select-none">
          <input
            checked={isPublished}
            className="accent-white"
            onChange={(e) => setIsPublished(e.target.checked)}
            type="checkbox"
          />
          Publicado
        </label>

        {currentPath ? (
          <Link
            className="shrink-0 rounded p-1.5 text-white/35 transition hover:bg-white/8 hover:text-white/65"
            href={currentPath}
            target="_blank"
            title={`Abrir ${currentPath}`}
          >
            <ExternalLink aria-hidden size={14} />
          </Link>
        ) : null}

        <button
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-white/90 disabled:opacity-60"
          disabled={isSaving}
          type="button"
          onClick={handleSaveProject}
        >
          <Save aria-hidden size={12} />
          {isSaving ? "Guardando..." : mode === "create" ? "Crear" : "Guardar"}
        </button>

        {message ? (
          <span className="shrink-0 text-xs text-white/45">{message}</span>
        ) : null}
      </div>

      {/* Split panel */}
      <div className="flex min-h-0 flex-1">
        {/* Editor panel — same DOM node, only classes change to avoid remounting Monaco */}
        <div
          className={
            isEditorFullscreen
              ? "fixed inset-0 z-50 flex flex-col bg-[#1e1e1e]"
              : "flex min-h-0 w-1/2 flex-col border-r border-white/10"
          }
        >
          <div className="flex h-9 shrink-0 items-center justify-between border-b border-white/10 bg-[#111] px-3">
            <span className="font-mono text-xs text-white/35">index.html</span>
            <button
              className="rounded p-1 text-white/35 transition hover:bg-white/8 hover:text-white/65"
              title={
                isEditorFullscreen
                  ? "Salir de pantalla completa"
                  : "Pantalla completa"
              }
              type="button"
              onClick={() => setIsEditorFullscreen((v) => !v)}
            >
              {isEditorFullscreen ? (
                <Minimize2 aria-hidden size={14} />
              ) : (
                <Maximize2 aria-hidden size={14} />
              )}
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <Editor
              defaultLanguage="html"
              height="100%"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: "on",
                smoothScrolling: true,
                scrollBeyondLastLine: false,
                padding: { top: 12, bottom: 12 },
              }}
              theme="vs-dark"
              value={htmlContent}
              onChange={(value) => setHtmlContent(value ?? "")}
            />
          </div>
        </div>

        {/* Preview panel */}
        <div className="flex min-h-0 w-1/2 flex-col">
          <div className="flex h-9 shrink-0 items-center border-b border-white/10 bg-[#111] px-3">
            <span className="text-xs text-white/35">Preview</span>
          </div>
          <iframe
            className="min-h-0 flex-1 bg-white"
            sandbox="allow-scripts"
            srcDoc={htmlContent}
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}
