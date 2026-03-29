import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublishedProjectByPath,
  incrementProjectViews,
} from "@/lib/projects";
import { getSession } from "@/lib/session";

function extractHtmlTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[username]/[project]">): Promise<Metadata> {
  const { username, project } = await params;
  const projectData = await getPublishedProjectByPath(username, project);
  if (!projectData) return {};

  const htmlTitle = projectData.html_content
    ? extractHtmlTitle(projectData.html_content)
    : null;
  const title = htmlTitle ?? projectData.title;

  return {
    title,
    description: `${username}/${project} · bercel`,
  };
}

export default async function PublicProjectPage({
  params,
}: PageProps<"/[username]/[project]">) {
  const { username, project } = await params;

  const [projectData, session] = await Promise.all([
    getPublishedProjectByPath(username, project),
    getSession(),
  ]);

  if (!projectData) {
    notFound();
  }

  void incrementProjectViews(projectData.id).catch(() => {});

  const isOwner = session?.user?.id === projectData.user_id;

  if (!isOwner) {
    return (
      <iframe
        className="fixed inset-0 h-full w-full border-none"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts"
        srcDoc={projectData.html_content ?? ""}
        title={projectData.title}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 flex h-10 items-center justify-between border-b border-white/10 bg-black/80 px-4 backdrop-blur-sm">
        <p className="font-mono text-xs text-white/50">
          <Link
            className="transition hover:text-white/80"
            href={`/${projectData.username}`}
          >
            /{projectData.username}
          </Link>
          /{projectData.slug}
        </p>
        <span className="text-[11px] text-white/20">⚡ 0ms cold start</span>
        <Link
          className="rounded-lg border border-white/15 px-3 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
          href={`/dashboard/projects/${projectData.slug}`}
        >
          Editar
        </Link>
      </div>
      <iframe
        className="fixed inset-0 top-10 h-[calc(100%-40px)] w-full border-none"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts"
        srcDoc={projectData.html_content ?? ""}
        title={projectData.title}
      />
    </>
  );
}
