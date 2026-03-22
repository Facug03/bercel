import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedProjectByPath } from "@/lib/projects";

export default async function PublicProjectPage({
  params,
}: PageProps<"/[username]/[project]">) {
  const { username, project } = await params;

  const projectData = await getPublishedProjectByPath(username, project);

  if (!projectData) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-6 py-6 text-white">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-white/60">
            /{projectData.username}/{projectData.slug}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {projectData.title}
          </h1>
        </div>

        <Link
          className="text-sm text-white/70 underline underline-offset-4"
          href="/dashboard"
        >
          Ir al dashboard
        </Link>
      </header>

      <iframe
        className="h-[calc(100vh-140px)] w-full rounded-xl border border-white/10 bg-white"
        sandbox="allow-scripts"
        srcDoc={projectData.html_content ?? ""}
        title={projectData.title}
      />
    </main>
  );
}
