import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white">
      <div className="text-center">
        <p className="font-mono text-xs tracking-[0.25em] text-white/25 uppercase">Error 404</p>
        <h1 className="mt-4 text-7xl font-bold tracking-tight">404</h1>
        <p className="mt-4 text-lg text-white/60">Esta página no existe.</p>
        <p className="mt-1 text-sm text-white/30">Quizás nunca existió. Quizás la deployamos mal.</p>
        <div className="mt-2 inline-flex items-center gap-2 text-xs text-white/20">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ff4444]" />
          sistema: degradado
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            className="rounded-xl border border-white/15 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
            href="/"
          >
            Volver al inicio
          </Link>
          <Link
            className="text-sm text-white/40 transition hover:text-white/70"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
