"use client";

import { Input } from "@heroui/react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { ExploreSort } from "@/lib/projects";

const SORT_OPTIONS: { value: ExploreSort; label: string }[] = [
  { value: "recent", label: "Más recientes" },
  { value: "popular", label: "Más vistos" },
  { value: "oldest", label: "Más antiguos" },
];

type ExploreControlsProps = {
  query: string;
  sort: ExploreSort;
};

export function ExploreControls({ query, sort }: ExploreControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`/explore?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 transition-opacity ${isPending ? "opacity-60" : ""}`}
    >
      <div className="relative flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          size={14}
        />
        <Input
          aria-label="Buscar proyectos"
          className="pl-8"
          defaultValue={query}
          placeholder="Buscar por título o usuario…"
          spellCheck={false}
          variant="secondary"
          onChange={(e) => update("q", e.target.value)}
        />
      </div>

      <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`rounded-lg px-3 py-1.5 text-xs transition select-none ${
              sort === opt.value
                ? "bg-white/15 text-white"
                : "text-white/45 hover:text-white/70"
            }`}
            type="button"
            onClick={() => update("sort", opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
