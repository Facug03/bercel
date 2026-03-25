"use client";

import { Button, Card, Form, Input, Label, TextField } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsPending(true);

    if (mode === "register") {
      const { error } = await signUp.email({
        name,
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (error) {
        setMessage(error.message ?? "No se pudo crear la cuenta.");
        setIsPending(false);
        return;
      }

      router.replace("/dashboard");
      return;
    }

    const { error } = await signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (error) {
      setMessage(error.message ?? "Credenciales inválidas.");
      setIsPending(false);
      return;
    }

    router.replace("/dashboard");
  }

  async function handleGithubLogin() {
    setMessage(null);
    setIsPending(true);

    const { error } = await signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });

    if (error) {
      setMessage(error.message ?? "No se pudo iniciar con GitHub.");
      setIsPending(false);
      return;
    }

    setIsPending(false);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-6 py-10 text-white">
      <Card
        className="w-full border border-white/10 bg-[#111]/90 p-6"
        variant="default"
      >
        <Card.Header className="flex flex-col items-start gap-2 p-0">
          <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
            Bercel auth
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
          <p className="text-sm text-white/65">
            Con email y contraseña para publicar tu HTML en rutas como
            /[nombre].
          </p>
        </Card.Header>

        <Card.Content className="p-0 pt-5">
          <div className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                mode === "login" ? "bg-white text-black" : "text-white/70"
              }`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                mode === "register" ? "bg-white text-black" : "text-white/70"
              }`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <Form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <TextField
                className="w-full"
                isRequired
                name="name"
                value={name}
                variant="secondary"
                onChange={setName}
              >
                <Label>Nombre</Label>
                <Input autoComplete="name" />
              </TextField>
            ) : null}

            <TextField
              className="w-full"
              isRequired
              name="email"
              type="email"
              value={email}
              variant="secondary"
              onChange={setEmail}
            >
              <Label>Email</Label>
              <Input autoComplete="email" spellCheck={false} />
            </TextField>

            <TextField
              className="w-full"
              isRequired
              name="password"
              type="password"
              value={password}
              variant="secondary"
              onChange={setPassword}
            >
              <Label>Contraseña</Label>
              <Input
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
            </TextField>

            <Button
              className="w-full rounded-xl bg-white font-semibold text-black"
              isDisabled={isPending}
              type="submit"
              variant="primary"
            >
              {isPending
                ? "Procesando…"
                : mode === "login"
                  ? "Entrar"
                  : "Crear cuenta"}
            </Button>

            <Button
              className="w-full rounded-xl border border-white/20 text-white"
              isDisabled={isPending}
              type="button"
              variant="outline"
              onPress={handleGithubLogin}
            >
              Continuar con GitHub
            </Button>
          </Form>

          {message ? (
            <p className="mt-4 text-sm text-red-400/70" role="alert">
              {message}
            </p>
          ) : null}
        </Card.Content>

        <Card.Footer className="justify-between p-0 pt-5 text-sm text-white/55">
          <span>Email/password + GitHub.</span>
          <Link className="text-white/80 underline underline-offset-4" href="/">
            Volver
          </Link>
        </Card.Footer>
      </Card>
    </main>
  );
}
