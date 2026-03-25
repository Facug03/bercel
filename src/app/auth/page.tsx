import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AuthForm } from "./auth-form";

export default async function AuthPage() {
  const session = await getSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <AuthForm />;
}
