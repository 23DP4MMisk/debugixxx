import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Calendar, Clock, Plus, ArrowLeft, Trash2, LogOut } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { useI18n } from "@/lib/i18n";
import { getAllNews, deleteNews, isAdmin, setAdmin } from "@/lib/news-store";
import type { NewsItem } from "@/lib/news-data";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "All news · Debugix" },
      { name: "description", content: "All news, product updates and engineering notes from the Debugix team." },
      { property: "og:title", content: "All news · Debugix" },
      { property: "og:description", content: "All news, product updates and engineering notes from the Debugix team." },
    ],
  }),
  component: NewsListPage,
});

function NewsListPage() {
  const { t, lang } = useI18n();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [admin, setAdminState] = useState(false);
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);

  // Read from SQLite-backed server function
  useEffect(() => {
    let alive = true;
    getAllNews().then((list) => {
      if (alive) setItems(list);
    });
    setAdminState(isAdmin());
    return () => {
      alive = false;
    };
  }, []);

  async function handleDelete(slug: string) {
    await deleteNews(slug);
    const list = await getAllNews();
    setItems(list);
    setConfirmSlug(null);
  }

  const confirmItem = items.find((n) => n.slug === confirmSlug);

  return (
    <SiteShell theme="v1">
      <section className="container-page py-16 md:py-24">
        <Link to="/" hash="news" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-brand">
          <ArrowLeft className="h-4 w-4" /> {t("news.back")}
        </Link>

        <div className="mt-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-3">
              <span className="font-mono text-xs text-brand">[03]</span>
              <span className="h-px w-10 bg-brand" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {t("news.eyebrow")}
              </span>
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">{t("news.title")}</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">{t("news.subtitle")}</p>
          </div>
          <Link
            to="/admin/news"
            className="inline-flex items-center gap-2 bg-gradient-brand px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-brand-foreground shadow-glow"
          >
            <Plus className="h-4 w-4" /> {t("news.addNews")}
          </Link>
          {admin && (
            <button
              type="button"
              onClick={() => {
                setAdmin(false);
                setAdminState(false);
              }}
              className="inline-flex items-center gap-2 border border-border bg-surface/60 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-surface"
            >
              <LogOut className="h-4 w-4" /> {t("news.logout")}
            </button>
          )}
        </div>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {items.length === 0 && (
            <div className="py-12 text-center font-mono text-sm text-muted-foreground">
              › no news yet
            </div>
          )}
          {items.map((n, i) => (
            <div key={n.slug} className="relative group">
              <Link
                to="/news/$slug"
                params={{ slug: n.slug }}
                className="grid md:grid-cols-12 gap-6 py-6 items-center hover:bg-surface/40 transition-colors px-2 md:px-4 -mx-2 md:-mx-4"
              >
                <div className="md:col-span-1 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</div>
                <div className="md:col-span-3 aspect-[16/10] overflow-hidden border border-border">
                  <img src={n.cover} alt={n.title[lang]} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="md:col-span-6">
                  <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    <span className="text-brand">{n.category[lang]}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {fmtDate(n.publishedAt, lang)}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {n.readMinutes} {t("news.minRead")}</span>
                  </div>
                  <h2 className="mt-2 text-xl md:text-2xl font-semibold leading-snug group-hover:text-brand transition-colors">
                    {n.title[lang]}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{n.excerpt[lang]}</p>
                </div>
                <div className="md:col-span-2 flex md:justify-end">
                  <span className="inline-flex items-center gap-2 font-mono text-xs text-brand">
                    {t("cta.readMore")} <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
              {admin && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setConfirmSlug(n.slug);
                  }}
                  className="absolute top-3 right-3 inline-flex items-center gap-1.5 border border-destructive/40 bg-background/90 backdrop-blur px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> {t("news.delete")}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {confirmItem && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm p-4"
          onClick={() => setConfirmSlug(null)}
        >
          <div
            className="w-full max-w-md border border-border bg-surface shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("confirm.heading")}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold">{t("confirm.title")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("confirm.body").replace("{title}", confirmItem.title[lang])}
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmSlug(null)}
                  className="border border-border bg-background px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-surface"
                >
                  {t("confirm.cancel")}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(confirmItem.slug)}
                  className="inline-flex items-center gap-2 bg-destructive px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-destructive-foreground hover:opacity-90"
                >
                  <Trash2 className="h-4 w-4" /> {t("confirm.delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteShell>
  );
}

function fmtDate(iso: string, lang: "en" | "lv") {
  return new Date(iso).toLocaleDateString(lang === "lv" ? "lv-LV" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
}
