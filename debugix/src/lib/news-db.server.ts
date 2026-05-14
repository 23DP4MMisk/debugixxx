import Database from "better-sqlite3";
import { mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { newsItems, type NewsItem } from "./news-data";

// SQLite database file. Override with DATA_DIR env var (e.g. Railway volume).
const DATA_DIR = process.env.DATA_DIR
  ? resolve(process.env.DATA_DIR)
  : resolve(process.cwd(), "data");
const DB_PATH = resolve(DATA_DIR, "news.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;
  const dir = dirname(DB_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS news (
      slug          TEXT PRIMARY KEY,
      title_en      TEXT NOT NULL,
      title_lv      TEXT NOT NULL,
      excerpt_en    TEXT NOT NULL,
      excerpt_lv    TEXT NOT NULL,
      body_en       TEXT NOT NULL,
      body_lv       TEXT NOT NULL,
      cover         TEXT NOT NULL,
      published_at  TEXT NOT NULL,
      read_minutes  INTEGER NOT NULL,
      author        TEXT NOT NULL,
      category_en   TEXT NOT NULL,
      category_lv   TEXT NOT NULL,
      created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    );
    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  _db = db;
  seedIfEmpty(db);
  return db;
}

function seedIfEmpty(db: Database.Database) {
  const seeded = db
    .prepare("SELECT value FROM meta WHERE key = 'seeded'")
    .get() as { value: string } | undefined;
  if (seeded) return;
  const insert = db.prepare(`
    INSERT OR IGNORE INTO news
      (slug, title_en, title_lv, excerpt_en, excerpt_lv, body_en, body_lv,
       cover, published_at, read_minutes, author, category_en, category_lv)
    VALUES (@slug, @title_en, @title_lv, @excerpt_en, @excerpt_lv, @body_en, @body_lv,
            @cover, @published_at, @read_minutes, @author, @category_en, @category_lv)
  `);
  const tx = db.transaction((items: NewsItem[]) => {
    for (const n of items) {
      insert.run({
        slug: n.slug,
        title_en: n.title.en,
        title_lv: n.title.lv,
        excerpt_en: n.excerpt.en,
        excerpt_lv: n.excerpt.lv,
        body_en: n.body.en,
        body_lv: n.body.lv,
        cover: n.cover,
        published_at: n.publishedAt,
        read_minutes: n.readMinutes,
        author: n.author,
        category_en: n.category.en,
        category_lv: n.category.lv,
      });
    }
  });
  tx(newsItems);
  db.prepare("INSERT INTO meta (key, value) VALUES ('seeded', '1')").run();
}

type Row = {
  slug: string;
  title_en: string; title_lv: string;
  excerpt_en: string; excerpt_lv: string;
  body_en: string; body_lv: string;
  cover: string;
  published_at: string;
  read_minutes: number;
  author: string;
  category_en: string; category_lv: string;
  created_at: number;
};

function rowToItem(r: Row): NewsItem {
  return {
    slug: r.slug,
    title: { en: r.title_en, lv: r.title_lv },
    excerpt: { en: r.excerpt_en, lv: r.excerpt_lv },
    body: { en: r.body_en, lv: r.body_lv },
    cover: r.cover,
    publishedAt: r.published_at,
    readMinutes: r.read_minutes,
    author: r.author,
    category: { en: r.category_en, lv: r.category_lv },
  };
}

export function dbListNews(): NewsItem[] {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM news ORDER BY created_at DESC, published_at DESC"
    )
    .all() as Row[];
  return rows.map(rowToItem);
}

export function dbGetNews(slug: string): NewsItem | undefined {
  const db = getDb();
  const r = db.prepare("SELECT * FROM news WHERE slug = ?").get(slug) as
    | Row
    | undefined;
  return r ? rowToItem(r) : undefined;
}

export function dbAddNews(item: NewsItem): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO news
      (slug, title_en, title_lv, excerpt_en, excerpt_lv, body_en, body_lv,
       cover, published_at, read_minutes, author, category_en, category_lv)
    VALUES (@slug, @title_en, @title_lv, @excerpt_en, @excerpt_lv, @body_en, @body_lv,
            @cover, @published_at, @read_minutes, @author, @category_en, @category_lv)
  `).run({
    slug: item.slug,
    title_en: item.title.en,
    title_lv: item.title.lv,
    excerpt_en: item.excerpt.en,
    excerpt_lv: item.excerpt.lv,
    body_en: item.body.en,
    body_lv: item.body.lv,
    cover: item.cover,
    published_at: item.publishedAt,
    read_minutes: item.readMinutes,
    author: item.author,
    category_en: item.category.en,
    category_lv: item.category.lv,
  });
}

export function dbDeleteNews(slug: string): void {
  const db = getDb();
  db.prepare("DELETE FROM news WHERE slug = ?").run(slug);
}
