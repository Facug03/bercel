import { Skeleton } from "@heroui/react";

export default function ProjectEditorLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 shrink-0 items-center gap-3 border-b border-white/10 bg-[#0d0d0d] px-4">
        <Skeleton className="h-3 w-16 rounded bg-white/5 before:bg-white/5 after:via-white/10" />
        <Skeleton className="h-3 w-3 rounded bg-white/5 before:bg-white/5 after:via-white/10" />
        <Skeleton className="h-3 w-24 rounded bg-white/5 before:bg-white/5 after:via-white/10" />
      </div>
      <div className="flex min-h-0 flex-1">
        <Skeleton className="min-h-0 w-1/2 rounded-none border-r border-white/10 bg-white/3 before:bg-white/5 after:via-white/8" />
        <Skeleton className="min-h-0 w-1/2 rounded-none bg-white/3 before:bg-white/5 after:via-white/8" />
      </div>
    </div>
  );
}
