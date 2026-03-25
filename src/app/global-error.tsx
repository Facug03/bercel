"use client";

export default function GlobalError({
  error: err,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <p className="font-mono text-xs tracking-[0.25em] text-white/25 uppercase">
            Error crítico
          </p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight">
            Algo salió muy mal
          </h1>
          <p className="mt-4 text-base text-white/60">
            {err.message || "Ocurrió un error inesperado."}
          </p>
          {err.digest && (
            <p className="mt-1 font-mono text-xs text-white/20">{err.digest}</p>
          )}
          <button
            className="mt-8 rounded-xl border border-white/15 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
            onClick={reset}
            type="button"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
