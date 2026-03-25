"use client";

import { Card } from "@heroui/react";
import { Clock, Eye, Globe, TrendingUp } from "lucide-react";
import type { ProjectAnalytics } from "@/lib/projects";

type Props = {
  projects: ProjectAnalytics[];
};

function Sparkline({ data }: { data: number[] }) {
  const W = 120;
  const H = 36;
  const max = Math.max(...data, 1);

  const points = data
    .map((v, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * W;
      const y = H - (v / max) * (H - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPoints = [
    `0,${H}`,
    ...data.map((v, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * W;
      const y = H - (v / max) * (H - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }),
    `${W},${H}`,
  ].join(" ");

  const hasActivity = data.some((v) => v > 0);

  return (
    <svg
      aria-hidden="true"
      height={H}
      overflow="visible"
      viewBox={`0 0 ${W} ${H}`}
      width={W}
    >
      {hasActivity && (
        <polygon fill="currentColor" opacity={0.08} points={areaPoints} />
      )}
      <polyline
        fill="none"
        points={points}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        opacity={hasActivity ? 1 : 0.2}
      />
    </svg>
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}

export function AnalyticsClient({ projects }: Props) {
  const totalViews = projects.reduce((s, p) => s + p.totalViews, 0);
  const published = projects.filter((p) => p.isPublished).length;
  const topProject = projects[0] ?? null;
  const lastVisited = projects
    .filter((p) => p.lastVisitedAt !== null)
    .sort(
      (a, b) =>
        new Date(b.lastVisitedAt ?? 0).getTime() -
        new Date(a.lastVisitedAt ?? 0).getTime(),
    )[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Overview cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          className="border border-white/10 bg-[#111]/90 p-4"
          variant="default"
        >
          <Card.Content className="p-0">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/45">Visitas totales</p>
              <Eye aria-hidden className="text-white/25" size={14} />
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {totalViews.toLocaleString("es-AR")}
            </p>
            <p className="mt-0.5 text-xs text-white/40">
              en todos los proyectos
            </p>
          </Card.Content>
        </Card>

        <Card
          className="border border-white/10 bg-[#111]/90 p-4"
          variant="default"
        >
          <Card.Content className="p-0">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/45">Publicados</p>
              <Globe aria-hidden className="text-emerald-400/50" size={14} />
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-emerald-300">
              {published}
            </p>
            <p className="mt-0.5 text-xs text-white/40">
              de {projects.length} proyectos
            </p>
          </Card.Content>
        </Card>

        <Card
          className="border border-white/10 bg-[#111]/90 p-4"
          variant="default"
        >
          <Card.Content className="p-0">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/45">Más visitado</p>
              <TrendingUp aria-hidden className="text-white/25" size={14} />
            </div>
            {topProject ? (
              <>
                <p className="mt-2 truncate font-semibold">
                  {topProject.title}
                </p>
                <p className="mt-0.5 text-xs text-white/40">
                  {topProject.totalViews.toLocaleString("es-AR")} visitas
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-white/40">Sin datos</p>
            )}
          </Card.Content>
        </Card>

        <Card
          className="border border-white/10 bg-[#111]/90 p-4"
          variant="default"
        >
          <Card.Content className="p-0">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/45">Última visita</p>
              <Clock aria-hidden className="text-white/25" size={14} />
            </div>
            {lastVisited?.lastVisitedAt ? (
              <>
                <p className="mt-2 truncate font-semibold">
                  {lastVisited.title}
                </p>
                <p className="mt-0.5 text-xs text-white/40">
                  {relativeTime(lastVisited.lastVisitedAt)}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-white/40">Sin visitas aún</p>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Per-project breakdown */}
      <Card
        className="border border-white/10 bg-[#111]/90 p-5"
        variant="default"
      >
        <Card.Header className="p-0 pb-4">
          <h2 className="text-base font-semibold">
            Por proyecto · últimos 30 días
          </h2>
        </Card.Header>
        <Card.Content className="p-0">
          {projects.length === 0 ? (
            <p className="text-sm text-white/50">
              Todavía no hay datos. Las visitas se registran cuando alguien abre
              una URL pública.
            </p>
          ) : (
            <div className="divide-y divide-white/5">
              {projects.map((p) => (
                <div
                  className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4"
                  key={p.id}
                >
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] ${
                          p.isPublished
                            ? "bg-emerald-400/15 text-emerald-300"
                            : "bg-white/8 text-white/40"
                        }`}
                      >
                        {p.isPublished ? "publicado" : "borrador"}
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono text-xs text-white/40">
                      /{p.slug}
                    </p>
                  </div>

                  {/* Sparkline */}
                  <div className="w-full text-emerald-400 sm:w-auto sm:shrink-0">
                    <Sparkline data={p.dailyViews.map((d) => d.views)} />
                  </div>

                  {/* Stats */}
                  <div className="text-left sm:shrink-0 sm:text-right">
                    <div className="flex items-center gap-1 text-sm font-semibold sm:justify-end">
                      <Eye aria-hidden className="text-white/30" size={13} />
                      {p.totalViews.toLocaleString("es-AR")}
                    </div>
                    <p className="mt-0.5 text-xs text-white/35">
                      {p.lastVisitedAt != null
                        ? relativeTime(p.lastVisitedAt)
                        : "sin visitas"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
