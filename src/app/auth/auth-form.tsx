"use client";

import { Button, Card } from "@heroui/react";
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

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <label className="block space-y-1">
                <span className="text-sm text-white/75">Nombre</span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none transition focus:border-white/30"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
            ) : null}

            <label className="block space-y-1">
              <span className="text-sm text-white/75">Email</span>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none transition focus:border-white/30"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm text-white/75">Contraseña</span>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none transition focus:border-white/30"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            <Button
              className="w-full rounded-xl bg-white font-semibold text-black"
              isDisabled={isPending}
              type="submit"
              variant="primary"
            >
              {isPending
                ? "Procesando..."
                : mode === "login"
                  ? "Entrar"
                  : "Crear cuenta"}
            </Button>

            <Button
              className="w-full rounded-xl border border-white/20 text-white"
              isDisabled={isPending}
              onPress={handleGithubLogin}
              type="button"
              variant="outline"
            >
              Continuar con GitHub
            </Button>
          </form>

          {message ? (
            <p className="mt-4 text-sm text-red-400/70">{message}</p>
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
