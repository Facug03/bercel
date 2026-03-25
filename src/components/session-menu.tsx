"use client";

import { Avatar } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";

type SessionMenuProps = {
  className?: string;
  showDashboardLink?: boolean;
};

export function SessionMenu({
  className,
  showDashboardLink = true,
}: SessionMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data: session, isPending } = useSession();
  const fallbackInitial = (session?.user?.email?.[0] ?? "U").toUpperCase();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);

    const { error } = await signOut();
    setIsSigningOut(false);

    if (!error) {
      router.push("/");
      router.refresh();
    }
  }

  if (isPending) {
    return (
      <div
        className={`rounded-full border border-white/15 bg-white/5 p-1.5 ${className ?? ""}`}
      >
        <Avatar className="h-7 w-7" color="default" size="sm">
          <Avatar.Fallback>?</Avatar.Fallback>
        </Avatar>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <Link
        className={`whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] md:text-xs font-medium text-white/80 transition hover:bg-white/10 ${className ?? ""}`}
        href="/auth"
      >
        Entrar / Registrase
      </Link>
    );
  }

  return (
    <div className={`relative ${className ?? ""}`} ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Menú de usuario"
        className="flex cursor-pointer items-center gap-1 rounded-full border border-white/10 p-1.5 transition hover:bg-white/15"
        type="button"
        onClick={() => setIsOpen((v) => !v)}
      >
        <Avatar className="h-7 w-7" color="success" size="sm">
          <Avatar.Fallback>{fallbackInitial}</Avatar.Fallback>
        </Avatar>
        <span aria-hidden className="pr-1 text-[10px] text-emerald-200/80">
          ▾
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-30 mt-2 w-60 rounded-2xl border border-white/10 bg-[#111]/95 p-2 shadow-2xl backdrop-blur-md"
          role="menu"
        >
          <p className="px-3 py-2 text-xs text-white/50">
            {session.user.email}
          </p>

          {showDashboardLink ? (
            <Link
              className="block rounded-xl px-3 py-2 text-sm text-white/85 transition hover:bg-white/10"
              href="/dashboard"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Ir al dashboard
            </Link>
          ) : null}

          <button
            className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-red-200 transition hover:bg-red-400/10 disabled:opacity-60"
            disabled={isSigningOut}
            role="menuitem"
            type="button"
            onClick={handleSignOut}
          >
            {isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      )}
    </div>
  );
}
