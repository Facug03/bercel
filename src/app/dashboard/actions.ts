"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { deleteProject } from "@/lib/projects";

export async function deleteProjectAction(projectId: number): Promise<{ error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "No autenticado" };

  await deleteProject(session.user.id, projectId);
  revalidatePath("/dashboard");
  return {};
}
