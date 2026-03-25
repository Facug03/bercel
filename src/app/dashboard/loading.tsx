import { Skeleton } from "@heroui/react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Skeleton className="h-8 w-48 rounded-lg bg-white/5 before:bg-white/5 after:via-white/10" />
      <div className="rounded-2xl border border-white/10 bg-[#111]/90 p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-6 w-32 rounded-lg bg-white/5 before:bg-white/5 after:via-white/10" />
          <Skeleton className="h-9 w-full rounded-xl bg-white/5 before:bg-white/5 after:via-white/10 sm:w-36" />
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
