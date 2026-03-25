"use client";

import { BarChart2, LayoutGrid, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";

type DashboardSidebarProps = {
  userEmail: string;
  username: string | null;
};

export function DashboardSidebar({
  userEmail,
  username,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const initial = (userEmail[0] ?? "U").toUpperCase();

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
    window.location.href = "/";
  }

  const navItems = [
    {
      label: "Proyectos",
      href: "/dashboard",
      icon: <LayoutGrid aria-hidden size={15} />,
      isActive: pathname === "/dashboard",
    },
    {
      label: "Analíticas",
      href: "/dashboard/analytics",
      icon: <BarChart2 aria-hidden size={15} />,
      isActive: pathname === "/dashboard/analytics",
    },
    {
      label: "Perfil",
      href: "/dashboard/profile",
      icon: <UserRound aria-hidden size={15} />,
      isActive: pathname === "/dashboard/profile",
    },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-white/10 bg-[#0a0a0a]">
      <div className="flex h-14 items-center border-b border-white/10 px-5">
        <Link
          className="text-sm font-semibold tracking-tight text-white"
          href="/"
        >
          bercel
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 p-2 pt-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
              item.isActive
                ? "bg-white/10 text-white"
                : "text-white/50 hover:bg-white/5 hover:text-white/75"
            }`}
            href={item.href}
          >
            <span className={item.isActive ? "opacity-100" : "opacity-50"}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
          </span>
          <span className="text-[11px] text-white/30">
            Operacional <span className="text-white/20">(a veces)</span>
          </span>
        </div>
      </div>

      <div className="space-y-0.5 border-t border-white/10 p-3">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-semibold text-white">
            {initial}
          </div>
          <div className="min-w-0">
            <span className="block truncate text-xs text-white/50">
              {userEmail}
            </span>
            {username ? (
              <a
                className="block truncate font-mono text-[11px] text-white/25 transition hover:text-white/50"
                href={`/${username}`}
                target="_blank"
                rel="noreferrer"
              >
                /{username} ↗
              </a>
            ) : null}
          </div>
        </div>
        <button
          className="w-full rounded-lg px-3 py-1.5 text-left text-xs text-red-300/60 transition hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
          disabled={isSigningOut}
          type="button"
          onClick={handleSignOut}
        >
          {isSigningOut ? "Cerrando..." : "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
}
