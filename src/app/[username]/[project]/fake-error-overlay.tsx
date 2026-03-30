"use client";

import { useEffect, useState } from "react";

export function FakeErrorOverlay() {
  const [show, setShow] = useState(false);
  const [requestId] = useState(() => Math.random().toString(36).slice(2, 10));

  useEffect(() => {
    if (Math.random() < 0.1) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-full max-w-md px-8 text-center">
        <p className="font-mono text-5xl font-bold text-red-500">404</p>
        <p className="mt-1 font-mono text-xs text-white/20 line-through">
          Espera, este no es el error correcto.
        </p>
        <p className="font-mono text-5xl font-bold text-red-500">500</p>
        <p className="mt-3 text-xl font-semibold text-white">
          Error al cargar el proyecto
        </p>
        <p className="mt-2 text-sm text-white/50">
          No es un error, es una feature. Bueno, sí es un error.
        </p>
        <p className="mt-6 font-mono text-xs text-white/20">
          ERR_SERVER_NAP · request_id: {requestId}
        </p>
        <button
          type="button"
          className="mt-8 rounded-lg border border-white/15 px-5 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          onClick={() => setShow(false)}
        >
          Reintentar
        </button>
        <p className="mt-4 text-[11px] text-white/30">
          * puede que reintentar no sirva de nada
        </p>
      </div>
    </div>
  );
}
