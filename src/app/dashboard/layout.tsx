import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/projects";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/auth");
  }

  const profile = await getUserProfile(session.user.id);

  return (
    <div className="flex h-screen bg-black text-white">
      <DashboardSidebar
        userEmail={session.user.email}
        username={profile?.username ?? null}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        {children}
      </div>
    </div>
  );
}
