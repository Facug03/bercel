import { Card, Chip } from "@heroui/react";
import Link from "next/link";
import { SessionMenu } from "@/components/session-menu";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-15"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="pointer-events-none fixed left-0 right-0 top-0 z-10 h-0.5 bg-white/5 animate-[scan_6s_linear_infinite]" />

      <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-14 pt-8 sm:px-10 lg:px-14">
        <header className="flex items-center justify-between">
          <Chip
            className="border border-white/10 bg-white/5 text-[11px] tracking-[0.18em] text-white/75 uppercase"
            variant="tertiary"
          >
            Confiado por 0,3 developers
          </Chip>

          <SessionMenu />
        </header>

        <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center gap-7">
            <div className="flex items-center gap-4 animate-[flicker-master_4.7s_infinite] sm:gap-5">
              <div className="h-13 w-13 animate-[triangle-glitch_4.7s_infinite] filter-[drop-shadow(0_0_6px_#fff)]">
                <svg
                  viewBox="0 0 76 65"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Bercel logo</title>
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="white" />
                </svg>
              </div>

              <div className="relative">
                <span
                  className="block text-[2.4rem] leading-none font-bold tracking-[-0.03em] text-white sm:text-[4.2rem] animate-[text-flicker_4.7s_infinite]"
                  style={{
                    textShadow:
                      "0 0 8px #fff, 0 0 20px #fff, 0 0 40px rgba(255,255,255,0.4)",
                  }}
                >
                  BERCEL
                </span>
                <span
                  className="pointer-events-none absolute inset-0 block text-[2.4rem] leading-none font-bold tracking-[-0.03em] text-transparent [text-stroke:1px_rgba(255,255,255,0.15)] sm:text-[4.2rem] animate-[ghost-text_4.7s_infinite]"
                  aria-hidden
                >
                  BERCEL
                </span>
              </div>
            </div>

            <p className="animate-[tagline-flicker_4.7s_infinite] text-[0.72rem] tracking-[0.28em] text-white/35 uppercase">
              Ship it. Maybe.
            </p>

            <div className="mt-1 inline-flex items-center gap-2 animate-[status-flicker_4.7s_infinite] text-[0.64rem] tracking-[0.2em] text-white/40 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ff4444] animate-[dot-pulse_4.7s_infinite]" />
              sistema: degradado
            </div>

            <h1 className="mt-8 max-w-3xl text-balance text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
              Deployá tu web en segundos.
              <span className="block text-white/70">Si todo sale bien.</span>
            </h1>

            <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/65 sm:text-lg">
              Subí un archivo HTML y publicalo en una ruta
              <span className="mx-1 rounded bg-white/10 px-2 py-0.5 font-mono text-sm text-white">
                /[nombre]
              </span>
              elegida por vos. Aspecto enterprise, espíritu de hackatón.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                className="rounded-xl border border-white/15 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
                href="/auth"
              >
                Ship maybe
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card
            className="rounded-2xl border border-white/10 bg-[#111]/80 p-5 backdrop-blur-sm"
            variant="default"
          >
            <Card.Header className="p-0">
              <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
                Fiabilidad
              </p>
            </Card.Header>
            <Card.Content className="p-0 pt-2">
              <p className="text-2xl font-semibold">99,2% de uptime*</p>
              <p className="mt-2 text-sm text-white/60">
                * cuando el server está prendido.
              </p>
            </Card.Content>
          </Card>

          <Card
            className="rounded-2xl border border-white/10 bg-[#111]/80 p-5 backdrop-blur-sm"
            variant="default"
          >
            <Card.Header className="p-0">
              <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
                Publicación
              </p>
            </Card.Header>
            <Card.Content className="p-0 pt-2">
              <p className="text-2xl font-semibold">Subí HTML + elegí ruta</p>
              <p className="mt-2 text-sm text-white/60">
                Tu proyecto vive en{" "}
                <span className="text-white">/lo-que-elijas</span>.
              </p>
            </Card.Content>
          </Card>

          <Card
            className="rounded-2xl border border-white/10 bg-[#111]/80 p-5 backdrop-blur-sm"
            variant="default"
          >
            <Card.Header className="p-0">
              <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
                Madurez técnica
              </p>
            </Card.Header>
            <Card.Content className="p-0 pt-2">
              <p className="text-2xl font-semibold">
                Probablemente listo para prod
              </p>
              <p className="mt-2 text-sm text-white/60">
                Ideal para demos que parecen startup financiada.
              </p>
            </Card.Content>
          </Card>
        </section>
      </div>
    </main>
  );
}
