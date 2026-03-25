import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SessionMenu } from "@/components/session-menu";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/projects";
import { ProjectEditorForm, starterHtml } from "../../project-editor-form";

export default async function NewProjectPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/auth");
  }

  const profile = await getUserProfile(session.user.id);

  if (!profile?.username) {
    redirect("/dashboard/profile");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-8 text-white">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Crear proyecto
          </h1>
          <p className="text-sm text-white/60">
            Nuevo deploy en /{profile.username}/[slug]
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
        initialHtmlContent={starterHtml}
        initialIsPublished={true}
        initialSlug="mi-proyecto"
        initialTitle="Mi Proyecto"
        mode="create"
        username={profile.username}
      />
    </main>
  );
}
