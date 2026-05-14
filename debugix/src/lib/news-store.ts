import type { NewsItem } from "./news-data";
import {
  addNewsFn,
  deleteNewsFn,
  getNewsFn,
  listNewsFn,
} from "./news.functions";

const ADMIN_KEY = "debugix-admin-authed";

export type UserNewsItem = NewsItem;

function isBrowser() {
  return typeof window !== "undefined";
}

// ─────────── News (SQLite-backed via server functions) ───────────

export async function getAllNews(): Promise<NewsItem[]> {
  return await listNewsFn();
}

export async function getNewsBySlugAll(
  slug: string,
): Promise<NewsItem | undefined> {
  const item = await getNewsFn({ data: { slug } });
  return item ?? undefined;
}

export async function addUserNews(item: UserNewsItem): Promise<void> {
  await addNewsFn({ data: item });
}

export async function deleteNews(slug: string): Promise<void> {
  await deleteNewsFn({ data: { slug } });
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80) || `news-${Date.now()}`
  );
}

// ─────────── Admin session (still client-only) ───────────
export function isAdmin(): boolean {
  if (!isBrowser()) return false;
  return window.sessionStorage.getItem(ADMIN_KEY) === "1";
}

export function setAdmin(value: boolean) {
  if (!isBrowser()) return;
  if (value) window.sessionStorage.setItem(ADMIN_KEY, "1");
  else window.sessionStorage.removeItem(ADMIN_KEY);
}
