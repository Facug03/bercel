import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { getUserProfile } from "@/lib/projects";
import { getSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth");
  }

  const profile = await getUserProfile(session.user.id);

  return (
    <div className="flex min-h-screen flex-col bg-black text-white md:h-screen md:flex-row">
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
