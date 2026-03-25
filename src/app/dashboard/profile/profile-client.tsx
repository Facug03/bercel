"use client";

import { Button, Card } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";

type ProfileClientProps = {
  initialUsername: string;
};

export function ProfileClient({ initialUsername }: ProfileClientProps) {
  const [usernameInput, setUsernameInput] = useState(initialUsername);
  const [username, setUsername] = useState(initialUsername);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSaveUsername() {
    setMessage(null);
    setIsSaving(true);

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: usernameInput }),
    });

    const data = (await response.json()) as {
      error?: string;
      profile?: { username: string };
    };

    if (!response.ok || !data.profile) {
      setMessage(data.error ?? "No se pudo guardar el username.");
      setIsSaving(false);
      return;
    }

    setUsername(data.profile.username);
    setUsernameInput(data.profile.username);
    setMessage("Username guardado.");
    setIsSaving(false);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-8 text-white">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
            Perfil
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Tu username</h1>
          <p className="text-sm text-white/60">
            Este username define tus rutas públicas.
          </p>
        </div>
        <Link
          className="text-sm text-white/70 underline underline-offset-4"
          href="/dashboard"
        >
          Volver al dashboard
        </Link>
      </header>

      <Card
        className="border border-white/10 bg-[#111]/90 p-5"
        variant="default"
      >
        <Card.Content className="space-y-4 p-0">
          <label className="block space-y-1">
            <span className="text-sm text-white/70">Username (requerido)</span>
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none transition focus:border-white/30"
              onChange={(event) => setUsernameInput(event.target.value)}
              placeholder="tu-username"
              value={usernameInput}
            />
          </label>

          <Button
            className="w-full rounded-xl border border-white/20 text-white"
            isDisabled={isSaving}
            onPress={handleSaveUsername}
            variant="outline"
          >
            {isSaving ? "Guardando..." : "Guardar username"}
          </Button>

          <p className="text-sm text-white/55">
            Tu base URL será:
            <span className="ml-1 rounded bg-white/10 px-2 py-0.5 font-mono text-white">
              /{username || "tu-username"}
            </span>
          </p>

          {message ? <p className="text-sm text-white/70">{message}</p> : null}

          {!!username && (
            <Link
              className="inline-block text-sm text-white underline underline-offset-4"
              href="/dashboard/projects/new"
            >
              Continuar a crear proyecto
            </Link>
          )}
        </Card.Content>
      </Card>
    </main>
  );
}
