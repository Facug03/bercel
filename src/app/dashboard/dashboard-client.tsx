"use client";

import { Button, Card } from "@heroui/react";
import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { deleteProjectAction } from "./actions";

type ProjectSummary = {
  id: number;
  slug: string;
  title: string;
  isPublished: boolean;
  updatedAt: string;
  views: number;
  lastVisitedAt: string | null;
};

type DashboardClientProps = {
  initialUsername: string | null;
  initialProjects: ProjectSummary[];
};

export function DashboardClient({
  initialUsername,
  initialProjects,
}: DashboardClientProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const total = initialProjects.length;

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeletingId(pendingDelete.id);
    setPendingDelete(null);
    await deleteProjectAction(pendingDelete.id);
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-6 px-8 py-8">
      <ConfirmDialog
        confirmLabel="Eliminar"
        description={`¿Eliminar "${pendingDelete?.title}"? Esta acción no se puede deshacer.`}
        isDestructive
        isOpen={!!pendingDelete}
        isPending={deletingId !== null}
        title="Eliminar proyecto"
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
      {/* Projects list */}
      <Card
        className="border border-white/10 bg-[#111]/90 p-5"
        variant="default"
      >
        <Card.Header className="flex items-center justify-between p-0 pb-3">
          <h2 className="text-lg font-semibold">Proyectos ({total})</h2>
          <Link
            href={
              initialUsername ? "/dashboard/projects/new" : "/dashboard/profile"
            }
          >
            <Button
              className="rounded-xl bg-white font-semibold text-black"
              variant="primary"
            >
              Nuevo proyecto
            </Button>
          </Link>
        </Card.Header>
        <Card.Content className="space-y-2 p-0">
          {total === 0 ? (
            <div className="py-4 text-center">
              <p className="text-sm text-white/60">
                Todavía no shippeaste nada.
              </p>
              <p className="mt-1 text-xs text-white/30">Maybe.</p>
            </div>
          ) : (
            initialProjects.map((project) => {
              const path = initialUsername
                ? `/${initialUsername}/${project.slug}`
                : null;

              return (
                <article
                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                  key={project.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="font-mono text-xs text-white/50">
                        /{project.slug}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-white/40">
                        <Eye aria-hidden size={12} />
                        {project.views.toLocaleString("es-AR")}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          project.isPublished
                            ? "bg-emerald-400/15 text-emerald-300"
                            : "bg-white/10 text-white/55"
                        }`}
                      >
                        {project.isPublished ? "Publicado" : "Borrador"}
                      </span>
                    </div>
                  </div>

                  <p className="mt-1.5 text-xs text-white/40">
                    Actualizado:{" "}
                    {new Date(project.updatedAt).toLocaleString("es-AR")}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Link
                        className="text-sm text-white underline underline-offset-4"
                        href={`/dashboard/projects/${project.slug}`}
                      >
                        Ver más / editar
                      </Link>

                      {path ? (
                        <Link
                          className="text-sm text-white/70 underline underline-offset-4"
                          href={path}
                          target="_blank"
                        >
                          Abrir URL pública
                        </Link>
                      ) : null}
                    </div>
                    <Button
                      aria-label={`Eliminar "${project.title}"`}
                      className="h-auto min-w-0 gap-1 px-2 py-1 text-xs text-red-400/50 hover:text-red-400"
                      isDisabled={deletingId === project.id}
                      size="sm"
                      variant="ghost"
                      onPress={() =>
                        setPendingDelete({
                          id: project.id,
                          title: project.title,
                        })
                      }
                    >
                      <Trash2 aria-hidden size={12} />
                      {deletingId === project.id ? "Eliminando…" : "Eliminar"}
                    </Button>
                  </div>
                </article>
              );
            })
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
