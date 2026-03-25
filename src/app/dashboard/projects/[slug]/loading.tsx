import { Skeleton } from "@heroui/react";

export default function ProjectEditorLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 shrink-0 items-center gap-3 border-b border-white/10 bg-[#0d0d0d] px-3 sm:px-4">
        <Skeleton className="h-3 w-16 rounded bg-white/5 before:bg-white/5 after:via-white/10" />
        <Skeleton className="h-3 w-3 rounded bg-white/5 before:bg-white/5 after:via-white/10" />
        <Skeleton className="h-3 w-24 rounded bg-white/5 before:bg-white/5 after:via-white/10" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <Skeleton className="min-h-80 w-full flex-1 rounded-none border-b border-white/10 bg-white/3 before:bg-white/5 after:via-white/8 lg:min-h-0 lg:w-1/2 lg:border-r lg:border-b-0" />
        <Skeleton className="min-h-72 w-full flex-1 rounded-none bg-white/3 before:bg-white/5 after:via-white/8 lg:min-h-0 lg:w-1/2" />
      </div>
    </div>
  );
}
