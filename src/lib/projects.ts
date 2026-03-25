import { db } from "@/lib/db";

export const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,32}$/;
export const PROJECT_SLUG_REGEX = /^[a-z0-9-]{1,64}$/;

export type UserProfile = {
  userId: string;
  username: string;
};

export type ProjectSummary = {
  id: number;
  slug: string;
  title: string;
  isPublished: boolean;
  updatedAt: string;
};

export type ProjectDetail = ProjectSummary & {
  htmlContent: string;
};

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const result = await db.query<{
    user_id: string;
    username: string;
  }>(
    `
      SELECT user_id, username
      FROM public.user_profile
      WHERE user_id = $1
      LIMIT 1
    `,
    [userId],
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return {
    userId: row.user_id,
    username: row.username,
  };
}

export async function upsertUsername(
  userId: string,
  username: string,
): Promise<UserProfile> {
  const result = await db.query<{
    user_id: string;
    username: string;
  }>(
    `
      INSERT INTO public.user_profile (user_id, username)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET username = EXCLUDED.username, updated_at = NOW()
      RETURNING user_id, username
    `,
    [userId, username],
  );

  const row = result.rows[0];

  return {
    userId: row.user_id,
    username: row.username,
  };
}

export async function listProjectsByUser(
  userId: string,
): Promise<ProjectSummary[]> {
  const result = await db.query<{
    id: number;
    slug: string;
    title: string;
    is_published: boolean;
    updated_at: Date;
  }>(
    `
      SELECT id, slug, title, is_published, updated_at
      FROM public.project
      WHERE user_id = $1
      ORDER BY updated_at DESC
    `,
    [userId],
  );

  return result.rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    isPublished: row.is_published,
    updatedAt: row.updated_at.toISOString(),
  }));
}

export async function getProjectByUserAndSlug(
  userId: string,
  slug: string,
): Promise<ProjectDetail | null> {
  const result = await db.query<{
    id: number;
    slug: string;
    title: string;
    html_content: string | null;
    is_published: boolean;
    updated_at: Date;
  }>(
    `
      SELECT id, slug, title, html_content, is_published, updated_at
      FROM public.project
      WHERE user_id = $1
        AND LOWER(slug) = LOWER($2)
      LIMIT 1
    `,
    [userId, slug],
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    htmlContent: row.html_content ?? "",
    isPublished: row.is_published,
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function upsertProjectBySlug(input: {
  userId: string;
  slug: string;
  title: string;
  htmlContent: string;
  isPublished: boolean;
}): Promise<ProjectSummary> {
  const update = await db.query<{
    id: number;
    slug: string;
    title: string;
    is_published: boolean;
    updated_at: Date;
  }>(
    `
      UPDATE public.project
      SET
        title = $3,
        html_content = $4,
        is_published = $5,
        updated_at = NOW()
      WHERE user_id = $1
        AND LOWER(slug) = LOWER($2)
      RETURNING id, slug, title, is_published, updated_at
    `,
    [
      input.userId,
      input.slug,
      input.title,
      input.htmlContent,
      input.isPublished,
    ],
  );

  const existing = update.rows[0];
  if (existing) {
    return {
      id: existing.id,
      slug: existing.slug,
      title: existing.title,
      isPublished: existing.is_published,
      updatedAt: existing.updated_at.toISOString(),
    };
  }

  const created = await db.query<{
    id: number;
    slug: string;
    title: string;
    is_published: boolean;
    updated_at: Date;
  }>(
    `
      INSERT INTO public.project (user_id, slug, title, html_content, is_published)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, slug, title, is_published, updated_at
    `,
    [
      input.userId,
      input.slug,
      input.title,
      input.htmlContent,
      input.isPublished,
    ],
  );

  const row = created.rows[0];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    isPublished: row.is_published,
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function getPublishedProjectByPath(
  username: string,
  slug: string,
) {
  const result = await db.query<{
    username: string;
    slug: string;
    title: string;
    html_content: string | null;
    updated_at: Date;
  }>(
    `
      SELECT up.username, p.slug, p.title, p.html_content, p.updated_at
      FROM public.user_profile up
      INNER JOIN public.project p ON p.user_id = up.user_id
      WHERE LOWER(up.username) = LOWER($1)
        AND LOWER(p.slug) = LOWER($2)
        AND p.is_published = TRUE
      LIMIT 1
    `,
    [username, slug],
  );

  return result.rows[0] ?? null;
}
