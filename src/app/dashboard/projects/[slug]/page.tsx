import { notFound, redirect } from "next/navigation";
import { getProjectByUserAndSlug, getUserProfile } from "@/lib/projects";
import { getSession } from "@/lib/session";
import { ProjectEditorForm } from "../../project-editor-form";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await getSession();

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
    <div className="flex h-full flex-col">
      <ProjectEditorForm
        initialHtmlContent={project.htmlContent}
        initialIsPublished={project.isPublished}
        initialSlug={project.slug}
        initialTitle={project.title}
        mode="edit"
        username={profile.username}
      />
    </div>
  );
}
