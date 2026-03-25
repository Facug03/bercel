import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/projects";
import { getSession } from "@/lib/session";
import { ProjectEditorForm, starterHtml } from "../../project-editor-form";

export default async function NewProjectPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/auth");
  }

  const profile = await getUserProfile(session.user.id);

  if (!profile?.username) {
    redirect("/dashboard/profile");
  }

  return (
    <div className="flex h-full flex-col">
      <ProjectEditorForm
        initialHtmlContent={starterHtml}
        initialIsPublished={true}
        initialSlug="mi-proyecto"
        initialTitle="Mi Proyecto"
        mode="create"
        username={profile.username}
      />
    </div>
  );
}
