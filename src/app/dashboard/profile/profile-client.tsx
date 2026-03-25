"use client";

import { Button, Card, Input, Label, TextField } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";

type ProfileClientProps = {
  initialUsername: string;
  userEmail: string;
};

export function ProfileClient({
  initialUsername,
  userEmail,
}: ProfileClientProps) {
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
    <div className="flex flex-col gap-6 px-8 py-8">
      <div>
        <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
          Perfil
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Tu perfil</h1>
      </div>

      <Card
        className="border border-white/10 bg-[#111]/90 p-5"
        variant="default"
      >
        <Card.Header className="p-0 pb-4">
          <h2 className="text-base font-semibold">Cuenta</h2>
        </Card.Header>
        <Card.Content className="space-y-4 p-0">
          <TextField
            isDisabled
            isReadOnly
            value={userEmail}
            variant="secondary"
          >
            <Label>Email</Label>
            <Input />
          </TextField>

          <TextField
            name="username"
            value={usernameInput}
            variant="secondary"
            onChange={setUsernameInput}
          >
            <Label>Username</Label>
            <Input
              autoComplete="username"
              placeholder="tu-username"
              spellCheck={false}
            />
          </TextField>

          <p className="text-sm text-white/50">
            Tu base URL será:
            <span className="ml-1 rounded bg-white/10 px-2 py-0.5 font-mono text-white/80">
              /{username || "tu-username"}
            </span>
          </p>

          <Button
            className="rounded-xl border border-white/20 text-white"
            isDisabled={isSaving}
            onPress={handleSaveUsername}
            variant="outline"
          >
            {isSaving ? "Guardando..." : "Guardar username"}
          </Button>

          {message ? <p className="text-sm text-white/70">{message}</p> : null}

          {!!username && (
            <Link
              className="inline-block text-sm text-white underline underline-offset-4"
              href="/dashboard/projects/new"
            >
              Continuar a crear proyecto →
            </Link>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
