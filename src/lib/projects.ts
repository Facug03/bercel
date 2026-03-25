import { cache } from "react";
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
  views: number;
  lastVisitedAt: string | null;
};

export type DailyViewEntry = {
  date: string;
  views: number;
};

export type ProjectAnalytics = {
  id: number;
  slug: string;
  title: string;
  isPublished: boolean;
  totalViews: number;
  lastVisitedAt: string | null;
  dailyViews: DailyViewEntry[];
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
    views: number;
    last_visited_at: Date | null;
  }>(
    `
      SELECT id, slug, title, is_published, updated_at, views, last_visited_at
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
    views: row.views,
    lastVisitedAt: row.last_visited_at?.toISOString() ?? null,
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
    views: number;
    last_visited_at: Date | null;
  }>(
    `
      SELECT id, slug, title, html_content, is_published, updated_at, views, last_visited_at
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
    views: row.views,
    lastVisitedAt: row.last_visited_at?.toISOString() ?? null,
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
    views: number;
    last_visited_at: Date | null;
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
      RETURNING id, slug, title, is_published, updated_at, views, last_visited_at
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
      views: existing.views,
      lastVisitedAt: existing.last_visited_at?.toISOString() ?? null,
    };
  }

  const created = await db.query<{
    id: number;
    slug: string;
    title: string;
    is_published: boolean;
    updated_at: Date;
    views: number;
    last_visited_at: Date | null;
  }>(
    `
      INSERT INTO public.project (user_id, slug, title, html_content, is_published)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, slug, title, is_published, updated_at, views, last_visited_at
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
    views: row.views,
    lastVisitedAt: row.last_visited_at?.toISOString() ?? null,
  };
}

export async function incrementProjectViews(projectId: number): Promise<void> {
  await db.query(
    `UPDATE public.project
     SET views = views + 1, last_visited_at = NOW()
     WHERE id = $1`,
    [projectId],
  );
  await db.query(
    `INSERT INTO public.project_daily_views (project_id, visit_date, views)
     VALUES ($1, CURRENT_DATE, 1)
     ON CONFLICT (project_id, visit_date)
     DO UPDATE SET views = project_daily_views.views + 1`,
    [projectId],
  );
}

export async function getAnalyticsForUser(
  userId: string,
  days = 30,
): Promise<ProjectAnalytics[]> {
  const projects = await db.query<{
    id: number;
    slug: string;
    title: string;
    is_published: boolean;
    views: number;
    last_visited_at: Date | null;
  }>(
    `SELECT id, slug, title, is_published, views, last_visited_at
     FROM public.project
     WHERE user_id = $1
     ORDER BY views DESC`,
    [userId],
  );

  if (projects.rows.length === 0) return [];

  const projectIds = projects.rows.map((r) => r.id);

  const daily = await db.query<{
    project_id: number;
    visit_date: Date;
    views: number;
  }>(
    `SELECT project_id, visit_date, views
     FROM public.project_daily_views
     WHERE project_id = ANY($1)
       AND visit_date >= CURRENT_DATE - ($2 - 1) * INTERVAL '1 day'
     ORDER BY visit_date ASC`,
    [projectIds, days],
  );

  const dailyByProject = new Map<number, Map<string, number>>();
  for (const row of daily.rows) {
    const dateKey = row.visit_date.toISOString().slice(0, 10);
    if (!dailyByProject.has(row.project_id)) {
      dailyByProject.set(row.project_id, new Map());
    }
    const projectMap = dailyByProject.get(row.project_id);
    if (projectMap) projectMap.set(dateKey, row.views);
  }

  const dateRange: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dateRange.push(d.toISOString().slice(0, 10));
  }

  return projects.rows.map((p) => {
    const map = dailyByProject.get(p.id) ?? new Map<string, number>();
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      isPublished: p.is_published,
      totalViews: p.views,
      lastVisitedAt: p.last_visited_at?.toISOString() ?? null,
      dailyViews: dateRange.map((date) => ({
        date,
        views: map.get(date) ?? 0,
      })),
    };
  });
}

export async function listRecentPublicProjects(limit = 12): Promise<
  {
    id: number;
    slug: string;
    title: string;
    username: string;
    views: number;
    updatedAt: string;
  }[]
> {
  const result = await db.query<{
    id: number;
    slug: string;
    title: string;
    username: string;
    views: number;
    updated_at: Date;
  }>(
    `SELECT p.id, p.slug, p.title, up.username, p.views, p.updated_at
     FROM public.project p
     INNER JOIN public.user_profile up ON up.user_id = p.user_id
     WHERE p.is_published = TRUE
     ORDER BY p.updated_at DESC
     LIMIT $1`,
    [limit],
  );

  return result.rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    username: r.username,
    views: r.views,
    updatedAt: r.updated_at.toISOString(),
  }));
}

export async function listPublicProjectsByUsername(username: string): Promise<{
  username: string;
  projects: {
    id: number;
    slug: string;
    title: string;
    views: number;
    updatedAt: string;
  }[];
} | null> {
  const profile = await db.query<{ username: string }>(
    `SELECT username FROM public.user_profile WHERE LOWER(username) = LOWER($1) LIMIT 1`,
    [username],
  );
  if (!profile.rows[0]) return null;

  const result = await db.query<{
    id: number;
    slug: string;
    title: string;
    views: number;
    updated_at: Date;
  }>(
    `SELECT id, slug, title, views, updated_at
     FROM public.project
     WHERE user_id = (SELECT user_id FROM public.user_profile WHERE LOWER(username) = LOWER($1))
       AND is_published = TRUE
     ORDER BY views DESC, updated_at DESC`,
    [username],
  );

  return {
    username: profile.rows[0].username,
    projects: result.rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      views: r.views,
      updatedAt: r.updated_at.toISOString(),
    })),
  };
}

export async function deleteProject(
  userId: string,
  projectId: number,
): Promise<void> {
  await db.query(`DELETE FROM public.project WHERE id = $1 AND user_id = $2`, [
    projectId,
    userId,
  ]);
}

export type ExploreSort = "recent" | "oldest" | "popular";

export type PublicProjectResult = {
  id: number;
  slug: string;
  title: string;
  username: string;
  views: number;
  updatedAt: string;
};

export async function searchPublicProjects({
  query = "",
  sort = "recent",
  limit = 24,
  offset = 0,
}: {
  query?: string;
  sort?: ExploreSort;
  limit?: number;
  offset?: number;
}): Promise<{ projects: PublicProjectResult[]; total: number }> {
  const orderBy =
    sort === "popular"
      ? "p.views DESC, p.updated_at DESC"
      : sort === "oldest"
        ? "p.updated_at ASC"
        : "p.updated_at DESC";

  const search = query.trim();
  const params: unknown[] = [limit, offset];
  let whereExtra = "";
  if (search) {
    params.push(`%${search}%`);
    whereExtra = `AND (p.title ILIKE $${params.length} OR up.username ILIKE $${params.length})`;
  }

  const [rows, countRow] = await Promise.all([
    db.query<{
      id: number;
      slug: string;
      title: string;
      username: string;
      views: number;
      updated_at: Date;
    }>(
      `SELECT p.id, p.slug, p.title, up.username, p.views, p.updated_at
       FROM public.project p
       INNER JOIN public.user_profile up ON up.user_id = p.user_id
       WHERE p.is_published = TRUE
       ${whereExtra}
       ORDER BY ${orderBy}
       LIMIT $1 OFFSET $2`,
      params,
    ),
    db.query<{ count: string }>(
      `SELECT COUNT(*) AS count
       FROM public.project p
       INNER JOIN public.user_profile up ON up.user_id = p.user_id
       WHERE p.is_published = TRUE
       ${whereExtra}`,
      search ? [params[2]] : [],
    ),
  ]);

  return {
    projects: rows.rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      username: r.username,
      views: r.views,
      updatedAt: r.updated_at.toISOString(),
    })),
    total: parseInt(countRow.rows[0]?.count ?? "0", 10),
  };
}

export const getPublishedProjectByPath = cache(
  async (username: string, slug: string) => {
    const result = await db.query<{
      id: number;
      user_id: string;
      username: string;
      slug: string;
      title: string;
      html_content: string | null;
      updated_at: Date;
    }>(
      `
      SELECT p.id, up.user_id, up.username, p.slug, p.title, p.html_content, p.updated_at
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
  },
);
