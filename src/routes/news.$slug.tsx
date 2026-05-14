import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock, User, Trash2 } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { newsItems, type NewsItem } from "@/lib/news-data";
import { getNewsBySlugAll, deleteNews, isAdmin } from "@/lib/news-store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/news/$slug")({
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const [item, setItem] = useState<NewsItem | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [admin, setAdminState] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    getNewsBySlugAll(slug).then((found) => {
      if (!alive) return;
      setItem(found);
      setReady(true);
    });
    setAdminState(isAdmin());
    return () => {
      alive = false;
    };
  }, [slug]);

  async function handleDelete() {
    if (!item) return;
    await deleteNews(item.slug);
    setConfirmOpen(false);
    navigate({ to: "/news" });
  }

  if (!item) {
    return (
      <SiteShell theme="v1">
        <div className="container-page py-32 text-center">
          <h1 className="font-display text-4xl font-bold">
            {ready ? "Article not found" : "Loading…"}
          </h1>
          <Link to="/news" className="mt-6 inline-block text-brand font-semibold">
            ← Back to news
          </Link>
        </div>
      </SiteShell>
    );
  }

  const related = newsItems.filter((n) => n.slug !== item.slug).slice(0, 2);

  return (
    <SiteShell theme="v1">
      <article>
        <div className="container-page pt-10 md:pt-14">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> {t("news.back")}
            </Link>
            {admin && (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-2 border border-destructive/40 bg-destructive/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <Trash2 className="h-4 w-4" /> {t("confirm.deleteArticle")}
              </button>
            )}
          </div>
        </div>

        <header className="container-page mt-8 max-w-3xl">
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
            {item.category[lang]}
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
            {item.title[lang]}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4" /> {item.author}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(item.publishedAt).toLocaleDateString(
                lang === "lv" ? "lv-LV" : "en-GB",
                { day: "numeric", month: "long", year: "numeric" },
              )}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" /> {item.readMinutes} {t("news.minRead")}
            </span>
          </div>
        </header>

        <div className="container-page mt-10">
          <img
            src={item.cover}
            alt={item.title[lang]}
            width={1280}
            height={832}
            className="w-full shadow-elevated aspect-[16/9] object-cover"
          />
        </div>

        <div className="container-page mt-12 max-w-3xl">
          <p className="text-lg leading-relaxed text-foreground/90">{item.excerpt[lang]}</p>
          <div className="mt-8 space-y-6 text-base leading-[1.8] text-muted-foreground">
            {item.body[lang].split("\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <section className="container-page mt-24">
          <h2 className="font-display text-2xl font-semibold mb-6">More from Debugix</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/news/$slug"
                params={{ slug: r.slug }}
                className="group flex gap-4 border border-border bg-surface p-4 hover:border-brand transition-colors"
              >
                <img
                  src={r.cover}
                  alt={r.title[lang]}
                  loading="lazy"
                  className="h-24 w-32 shrink-0 object-cover"
                />
                <div>
                  <div className="text-xs text-muted-foreground">{r.category[lang]}</div>
                  <div className="mt-1 font-display font-semibold leading-snug group-hover:text-brand">
                    {r.title[lang]}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </article>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm p-4"
          onClick={() => setConfirmOpen(false)}
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
                {t("confirm.body").replace("{title}", item.title[lang])}
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="border border-border bg-background px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-surface"
                >
                  {t("confirm.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
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
