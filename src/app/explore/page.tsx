import { Eye } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import type { ExploreSort } from "@/lib/projects";
import { searchPublicProjects } from "@/lib/projects";
import { ExploreControls } from "./explore-controls";

const PAGE_SIZE = 24;

const SORT_VALUES = new Set<ExploreSort>(["recent", "oldest", "popular"]);

function isValidSort(v: unknown): v is ExploreSort {
  return typeof v === "string" && SORT_VALUES.has(v as ExploreSort);
}

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  return {
    title: q ? `"${q}" — Explorar — Bercel` : "Explorar proyectos — Bercel",
  };
}

export default async function ExplorePage({ searchParams }: Props) {
  const params = await searchParams;

  const query = typeof params.q === "string" ? params.q : "";
  const sort: ExploreSort = isValidSort(params.sort) ? params.sort : "recent";
  const page = Math.max(
    1,
    parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1,
  );
  const offset = (page - 1) * PAGE_SIZE;

  const { projects, total } = await searchPublicProjects({
    query,
    sort,
    limit: PAGE_SIZE,
    offset,
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function buildPageUrl(p: number) {
    const sp = new URLSearchParams();
    if (query) sp.set("q", query);
    if (sort !== "recent") sp.set("sort", sort);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return `/explore${qs ? `?${qs}` : ""}`;
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-12 sm:px-10 lg:px-14">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-3">
            <Link
              className="text-xs tracking-[0.18em] text-white/30 uppercase transition hover:text-white/60"
              href="/"
            >
              Bercel
            </Link>
            <span className="text-white/15">/</span>
            <span className="text-xs tracking-[0.18em] text-white/50 uppercase">
              Explorar
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Proyectos públicos
          </h1>
          <p className="mt-1 text-sm text-white/45">
            {total.toLocaleString("es-AR")} proyecto{total !== 1 ? "s" : ""}{" "}
            publicado{total !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Controls */}
        <Suspense>
          <ExploreControls query={query} sort={sort} />
        </Suspense>

        {/* Grid */}
        <div className="mt-8">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-white/40">No se encontraron proyectos.</p>
              {query && (
                <Link
                  className="mt-3 text-sm text-white/30 underline underline-offset-4 hover:text-white/60"
                  href="/explore"
                >
                  Limpiar búsqueda
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group flex flex-col justify-between rounded-xl border border-white/8 bg-white/3 p-4 transition hover:border-white/15 hover:bg-white/5"
                >
                  <div className="min-w-0">
                    <Link
                      className="block truncate text-sm font-medium transition hover:text-white/80"
                      href={`/${project.username}/${project.slug}`}
                      target="_blank"
                    >
                      {project.title}
                    </Link>
                    <p className="mt-0.5 truncate font-mono text-xs text-white/30">
                      <Link
                        className="transition hover:text-white/60"
                        href={`/${project.username}`}
                      >
                        /{project.username}
                      </Link>
                      /{project.slug}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-white/25">
                      <Eye aria-hidden size={11} />
                      {project.views.toLocaleString("es-AR")}
                    </span>
                    <Link
                      className="text-xs text-white/30 transition hover:text-white/70"
                      href={`/${project.username}/${project.slug}`}
                      target="_blank"
                    >
                      abrir ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:border-white/25 hover:text-white/80"
                href={buildPageUrl(page - 1)}
              >
                ← Anterior
              </Link>
            )}

            <span className="px-2 text-sm text-white/30">
              {page} / {totalPages}
            </span>

            {page < totalPages && (
              <Link
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:border-white/25 hover:text-white/80"
                href={buildPageUrl(page + 1)}
              >
                Siguiente →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
