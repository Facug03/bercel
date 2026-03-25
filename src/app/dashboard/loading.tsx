import { Skeleton } from "@heroui/react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 px-8 py-8">
      <Skeleton className="h-8 w-48 rounded-lg bg-white/5 before:bg-white/5 after:via-white/10" />
      <div className="rounded-2xl border border-white/10 bg-[#111]/90 p-5">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-32 rounded-lg bg-white/5 before:bg-white/5 after:via-white/10" />
          <Skeleton className="h-9 w-36 rounded-xl bg-white/5 before:bg-white/5 after:via-white/10" />
        </div>
        <div className="space-y-3">
          {["a", "b", "c"].map((k) => (
            <Skeleton
              key={k}
              className="h-20 rounded-xl bg-white/5 before:bg-white/5 after:via-white/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
