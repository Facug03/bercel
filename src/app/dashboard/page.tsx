import { redirect } from "next/navigation";
import { getUserProfile, listProjectsByUser } from "@/lib/projects";
import { getSession } from "@/lib/session";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await getSession();

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
