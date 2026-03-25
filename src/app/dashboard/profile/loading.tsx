import { Skeleton } from "@heroui/react";

export default function ProfileLoading() {
  return (
    <div className="flex flex-col gap-6 px-8 py-8">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 rounded bg-white/5 before:bg-white/5 after:via-white/10" />
        <Skeleton className="h-9 w-32 rounded-lg bg-white/5 before:bg-white/5 after:via-white/10" />
      </div>
      <Skeleton className="h-40 w-full max-w-md rounded-2xl bg-white/5 before:bg-white/5 after:via-white/10" />
    </div>
  );
}
