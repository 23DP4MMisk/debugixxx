import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  dbAddNews,
  dbDeleteNews,
  dbGetNews,
  dbListNews,
} from "./news-db.server";
import type { NewsItem } from "./news-data";

const newsItemSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.object({ en: z.string(), lv: z.string() }),
  excerpt: z.object({ en: z.string(), lv: z.string() }),
  body: z.object({ en: z.string(), lv: z.string() }),
  cover: z.string().min(1),
  publishedAt: z.string().min(1),
  readMinutes: z.number().int().min(1).max(999),
  author: z.string().min(1).max(200),
  category: z.object({ en: z.string(), lv: z.string() }),
});

export const listNewsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<NewsItem[]> => {
    return dbListNews();
  },
);

export const getNewsFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }): Promise<NewsItem | null> => {
    return dbGetNews(data.slug) ?? null;
  });

export const addNewsFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => newsItemSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    dbAddNews(data as NewsItem);
    return { ok: true };
  });

export const deleteNewsFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    dbDeleteNews(data.slug);
    return { ok: true };
  });
