"use client";

import { Button, Card } from "@heroui/react";
import Link from "next/link";
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

export function DashboardClient({
  initialUsername,
  initialProjects,
  userEmail,
}: DashboardClientProps) {
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
          <Card.Header className="p-0 pb-3">
            <h2 className="text-lg font-semibold">Perfil público</h2>
          </Card.Header>
          <Card.Content className="space-y-3 p-0">
            <p className="text-sm text-white/65">
              Username actual:
              <span className="ml-1 rounded bg-white/10 px-2 py-0.5 font-mono text-white">
                /{initialUsername ?? "sin-username"}
              </span>
            </p>

            <Link href="/dashboard/profile">
              <Button
                className="w-full rounded-xl border border-white/20 text-white"
                variant="outline"
              >
                {initialUsername ? "Editar username" : "Configurar username"}
              </Button>
            </Link>

            {!initialUsername ? (
              <p className="text-sm text-amber-200/85">
                Antes de crear proyectos, configurá tu username.
              </p>
            ) : null}
          </Card.Content>
        </Card>

        <Card
          className="border border-white/10 bg-[#111]/90 p-5 lg:col-span-8"
          variant="default"
        >
          <Card.Header className="flex items-center justify-between p-0 pb-3">
            <h2 className="text-lg font-semibold">
              Proyectos ({initialProjects.length})
            </h2>
            <Link
              href={
                initialUsername
                  ? "/dashboard/projects/new"
                  : "/dashboard/profile"
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
          <Card.Content className="p-0">
            {initialProjects.length === 0 ? (
              <p className="text-sm text-white/60">
                Todavía no creaste proyectos.
              </p>
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

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Link
                        className="text-sm text-white underline underline-offset-4"
                        href={`/dashboard/projects/${project.slug}`}
                      >
                        Ver más / editar
                      </Link>

                      {path ? (
                        <Link
                          className="text-sm text-white/80 underline underline-offset-4"
                          href={path}
                          target="_blank"
                        >
                          Abrir URL pública
                        </Link>
                      ) : null}
                    </div>
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
