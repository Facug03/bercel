import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAnalyticsForUser } from "@/lib/projects";
import { AnalyticsClient } from "./analytics-client";

export default async function AnalyticsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/auth");
  }

  const analytics = await getAnalyticsForUser(session.user.id, 30);

  return (
    <div className="flex flex-col gap-6 px-8 py-8">
      <div>
        <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
          Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Analíticas</h1>
        <p className="text-sm text-white/50">Últimos 30 días por proyecto.</p>
      </div>
      <AnalyticsClient projects={analytics} />
    </div>
  );
}
