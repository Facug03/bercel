"use server";

import { revalidatePath } from "next/cache";
import {
  deleteProject,
  getUserProfile,
  PROJECT_SLUG_REGEX,
  upsertProjectBySlug,
} from "@/lib/projects";
import { getSession } from "@/lib/session";

export async function deleteProjectAction(
  projectId: number,
): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session?.user?.id) return { error: "No autenticado" };

  await deleteProject(session.user.id, projectId);
  revalidatePath("/dashboard");
  return {};
}

type SaveResult = { error: string } | { project: { slug: string } };

export async function saveProjectAction(input: {
  slug: string;
  title: string;
  htmlContent: string;
  isPublished: boolean;
}): Promise<SaveResult> {
  const session = await getSession();
  if (!session?.user?.id) return { error: "No autenticado" };

  const profile = await getUserProfile(session.user.id);
  if (!profile?.username) return { error: "Primero definí tu username." };

  const slug = input.slug.trim().toLowerCase();
  const title = input.title.trim();

  if (!slug || !PROJECT_SLUG_REGEX.test(slug)) {
    return {
      error: "Slug inválido. Usá minúsculas, números y guiones (1-64).",
    };
  }

  if (!title || title.length < 2) {
    return { error: "El título debe tener al menos 2 caracteres." };
  }

  const project = await upsertProjectBySlug({
    userId: session.user.id,
    slug,
    title,
    htmlContent: input.htmlContent,
    isPublished: input.isPublished,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/projects/${project.slug}`);

  return { project: { slug: project.slug } };
}
