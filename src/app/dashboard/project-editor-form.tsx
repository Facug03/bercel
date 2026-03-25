"use client";

import Editor from "@monaco-editor/react";
import {
  ExternalLink,
  Maximize2,
  Minimize2,
  Save,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { saveProjectAction } from "./actions";

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
  const router = useRouter();
  const [slug, setSlug] = useState(initialSlug);
  const [title, setTitle] = useState(initialTitle);
  const [htmlContent, setHtmlContent] = useState(initialHtmlContent);
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [showGenerateBar, setShowGenerateBar] = useState(false);
  const [previewHtml, setPreviewHtml] = useState(initialHtmlContent);

  useEffect(() => {
    const timer = setTimeout(() => setPreviewHtml(htmlContent), 300);
    return () => clearTimeout(timer);
  }, [htmlContent]);

  const currentPath = username && slug ? `/${username}/${slug}` : null;

  async function handleGenerate() {
    if (!generatePrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setHtmlContent("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: generatePrompt }),
      });

      if (!res.ok || !res.body) {
        const err = (await res.json()) as { error?: string };
        setMessage(err.error ?? "Error al generar.");
        setIsGenerating(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setHtmlContent(accumulated);
      }

      setShowGenerateBar(false);
      setGeneratePrompt("");
    } catch {
      setMessage("Error de conexión.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSaveProject() {
    setMessage(null);
    setIsSaving(true);

    const result = await saveProjectAction({
      slug,
      title,
      htmlContent,
      isPublished,
    });

    if ("error" in result) {
      setMessage(result.error);
      setIsSaving(false);
      return;
    }

    setMessage(mode === "create" ? "Proyecto creado." : "Guardado.");
    setIsSaving(false);

    if (mode === "create" && result.project?.slug) {
      router.push(`/dashboard/projects/${result.project.slug}`);
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
            <label className="sr-only" htmlFor="project-slug">
              Slug del proyecto
              <input
                className="w-32 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none transition placeholder:text-white/30 focus:border-white/25"
                id="project-slug"
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="slug"
                value={slug}
              />
            </label>
          )}
          <label className="sr-only" htmlFor="project-title">
            Título del proyecto
            <input
              className="w-48 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none transition placeholder:text-white/30 focus:border-white/25"
              id="project-title"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
              value={title}
            />
          </label>
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
          {isSaving
            ? "Deployando a 0 regiones..."
            : mode === "create"
              ? "Crear"
              : "Guardar"}
        </button>

        <output className="shrink-0 text-xs text-white/45">{message}</output>
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
            <div className="flex items-center gap-1">
              <button
                aria-label={
                  showGenerateBar ? "Cerrar generador IA" : "Generar con IA"
                }
                aria-pressed={showGenerateBar}
                className={`flex items-center gap-1 rounded px-2 py-1 text-[11px] transition ${
                  showGenerateBar
                    ? "bg-white/10 text-white/70"
                    : "text-white/35 hover:bg-white/8 hover:text-white/65"
                }`}
                type="button"
                onClick={() => setShowGenerateBar((v) => !v)}
              >
                <Sparkles aria-hidden size={13} />
                <span aria-hidden>IA</span>
              </button>
              <button
                aria-label={
                  isEditorFullscreen
                    ? "Salir de pantalla completa"
                    : "Pantalla completa"
                }
                className="rounded p-1 text-white/35 transition hover:bg-white/8 hover:text-white/65"
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
          </div>

          {/* AI generate bar */}
          {showGenerateBar && (
            <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-[#111]/80 px-3 py-2">
              <Sparkles
                aria-hidden
                className="shrink-0 text-white/30"
                size={13}
              />
              <input
                className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/25"
                disabled={isGenerating}
                placeholder="Describí tu página... (ej: landing para una pizzería)"
                value={generatePrompt}
                onChange={(e) => setGeneratePrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleGenerate();
                }}
              />
              <button
                className="shrink-0 rounded bg-white px-2.5 py-1 text-[11px] font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
                disabled={isGenerating || !generatePrompt.trim()}
                type="button"
                onClick={() => void handleGenerate()}
              >
                {isGenerating ? "Generando..." : "Generar"}
              </button>
            </div>
          )}
          <div className="min-h-0 flex-1">
            <Editor
              defaultLanguage="html"
              height="calc(100% - 28px)"
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
            <div className="flex h-7 items-center gap-4 border-t border-white/5 bg-[#1e1e1e] px-3">
              <span className="text-[11px] text-white/25">
                Syntax: HTML{" "}
                <span className="text-white/15">(probablemente)</span>
              </span>
              <span className="text-[11px] text-white/15">
                Auto-save: nunca
              </span>
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className="flex min-h-0 w-1/2 flex-col">
          <div className="flex h-9 shrink-0 items-center border-b border-white/10 bg-[#111] px-3">
            <span className="text-xs text-white/35">Preview</span>
          </div>
          <iframe
            className="min-h-0 flex-1 bg-black"
            sandbox="allow-scripts"
            srcDoc={previewHtml}
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}
