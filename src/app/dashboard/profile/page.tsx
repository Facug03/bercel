import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/projects";
import { ProfileClient } from "./profile-client";

export default async function DashboardProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

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
