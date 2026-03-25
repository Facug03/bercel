import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/projects";
import { getSession } from "@/lib/session";
import { ProfileClient } from "./profile-client";

export default async function DashboardProfilePage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/auth");
  }

  const profile = await getUserProfile(session.user.id);

  return (
    <ProfileClient
      initialUsername={profile?.username ?? ""}
      userEmail={session.user.email}
    />
  );
}
