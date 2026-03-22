import { auth } from "@/lib/auth";
import {
  getUserProfile,
  listProjectsByUser,
  PROJECT_SLUG_REGEX,
  upsertProjectBySlug,
} from "@/lib/projects";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user?.id) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const projects = await listProjectsByUser(session.user.id);

  return Response.json({ projects });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user?.id) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const profile = await getUserProfile(session.user.id);
  if (!profile?.username) {
    return Response.json(
      { error: "Primero definí tu username." },
      { status: 400 },
    );
  }

  const body = (await request.json()) as {
    slug?: string;
    title?: string;
    htmlContent?: string;
    isPublished?: boolean;
  };

  const slug = body.slug?.trim().toLowerCase();
  const title = body.title?.trim();
  const htmlContent = body.htmlContent ?? "";
  const isPublished = Boolean(body.isPublished);

  if (!slug || !PROJECT_SLUG_REGEX.test(slug)) {
    return Response.json(
      {
        error: "Slug inválido. Usá minúsculas, números y guiones (1-64).",
      },
      { status: 400 },
    );
  }

  if (!title || title.length < 2) {
    return Response.json(
      { error: "El título debe tener al menos 2 caracteres." },
      { status: 400 },
    );
  }

  const project = await upsertProjectBySlug({
    userId: session.user.id,
    slug,
    title,
    htmlContent,
    isPublished,
  });

  return Response.json({ project });
}
