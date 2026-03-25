import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserProfile, listProjectsByUser } from "@/lib/projects";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/auth");
  }

  const [profile, projects] = await Promise.all([
    getUserProfile(session.user.id),
    listProjectsByUser(session.user.id),
  ]);

  return (
    <DashboardClient
      initialProjects={projects}
      initialUsername={profile?.username ?? null}
    />
  );
}
