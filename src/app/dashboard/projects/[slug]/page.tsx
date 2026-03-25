import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SessionMenu } from "@/components/session-menu";
import { auth } from "@/lib/auth";
import { getProjectByUserAndSlug, getUserProfile } from "@/lib/projects";
import { ProjectEditorForm } from "../../project-editor-form";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/auth");
  }

  const [{ slug }, profile] = await Promise.all([
    params,
    getUserProfile(session.user.id),
  ]);

  if (!profile?.username) {
    redirect("/dashboard/profile");
  }

  const project = await getProjectByUserAndSlug(session.user.id, slug);
  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-8 text-white">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {project.title}
          </h1>
          <p className="text-sm text-white/60">
            Editando /{profile.username}/{project.slug}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            className="text-sm text-white/70 underline underline-offset-4"
            href="/dashboard"
          >
            Volver al dashboard
          </Link>
          <SessionMenu showDashboardLink={false} />
        </div>
      </header>

      <ProjectEditorForm
        initialHtmlContent={project.htmlContent}
        initialIsPublished={project.isPublished}
        initialSlug={project.slug}
        initialTitle={project.title}
        mode="edit"
        username={profile.username}
      />
    </main>
  );
}
