import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listPublicProjectsByUsername } from "@/lib/projects";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} · bercel`,
    description: `Proyectos publicados por ${username} en bercel.`,
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;
  const data = await listPublicProjectsByUsername(username);

  if (!data) notFound();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-4xl px-6 py-14">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between border-b border-white/10 pb-6">
          <div>
            <p className="text-xs tracking-[0.18em] text-white/35 uppercase">
              bercel
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              /{data.username}
            </h1>
            <p className="mt-1 text-sm text-white/45">
              {data.projects.length} proyecto
              {data.projects.length !== 1 ? "s" : ""} publicado
              {data.projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            className="text-xs text-white/30 transition hover:text-white/60"
            href="/"
          >
            bercel ↗
          </Link>
        </div>

        {/* Projects grid */}
        {data.projects.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-white/40">Todavía no hay nada publicado.</p>
            <p className="mt-1 text-xs text-white/20">Maybe.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.projects.map((project) => (
              <Link
                key={project.id}
                href={`/${data.username}/${project.slug}`}
                className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/3 p-5 transition hover:border-white/20 hover:bg-white/6"
              >
                <div>
                  <p className="font-medium leading-snug">{project.title}</p>
                  <p className="mt-1 font-mono text-xs text-white/35">
                    /{project.slug}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-white/30">
                    {project.views.toLocaleString("es-AR")} visitas
                  </span>
                  <span className="text-xs text-white/20 transition group-hover:text-white/50">
                    abrir ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
