import { Skeleton } from "@heroui/react";

export default function AnalyticsLoading() {
  return (
    <div className="flex flex-col gap-6 px-8 py-8">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 rounded bg-white/5 before:bg-white/5 after:via-white/10" />
        <Skeleton className="h-9 w-40 rounded-lg bg-white/5 before:bg-white/5 after:via-white/10" />
        <Skeleton className="h-4 w-56 rounded bg-white/5 before:bg-white/5 after:via-white/10" />
      </div>
      <div className="space-y-4">
        {["a", "b", "c"].map((k) => (
          <Skeleton
            key={k}
            className="h-32 rounded-2xl bg-white/5 before:bg-white/5 after:via-white/10"
          />
        ))}
      </div>
    </div>
  );
}
