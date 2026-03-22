import { auth } from "@/lib/auth";
import { getUserProfile, USERNAME_REGEX, upsertUsername } from "@/lib/projects";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user?.id) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const profile = await getUserProfile(session.user.id);

  return Response.json({ profile });
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user?.id) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = (await request.json()) as { username?: string };
  const username = body.username?.trim();

  if (!username || !USERNAME_REGEX.test(username)) {
    return Response.json(
      {
        error:
          "Username inválido. Usá 3-32 caracteres: letras, números, guion o underscore.",
      },
      { status: 400 },
    );
  }

  try {
    const profile = await upsertUsername(session.user.id, username);
    return Response.json({ profile });
  } catch (error) {
    const pgError = error as { code?: string };
    if (pgError.code === "23505") {
      return Response.json(
        { error: "Ese username ya está en uso." },
        { status: 409 },
      );
    }

    return Response.json(
      { error: "No se pudo guardar el username." },
      { status: 500 },
    );
  }
}
