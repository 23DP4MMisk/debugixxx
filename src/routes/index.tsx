import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight, ArrowUpRight, Code2, Wallet, Plug, LifeBuoy, ShieldCheck, Cloud,
  Calendar, Clock, MapPin, Mail, Phone, Activity,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { useI18n } from "@/lib/i18n";
import type { NewsItem } from "@/lib/news-data";
import { getAllNews } from "@/lib/news-store";
import heroBg from "@/assets/hero-v1.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Debugix · Midnight Signal — financial software & support" },
      { name: "description", content: "Engineering trust into every transaction. Financial software & support by Debugix." },
      { property: "og:title", content: "Debugix · Midnight Signal" },
      { property: "og:description", content: "Engineering trust into every transaction." },
    ],
  }),
  component: V1Template,
});

/* =====================================================================
   V1 — MIDNIGHT SIGNAL
   • Asymmetric split hero with grid backdrop + live "ticker" panel
   • Mono accents everywhere · sharp rectangles · neon glow
   • Stats as a Bloomberg-style ticker bar
   • Services as terminal-card grid with [00..05] indices
   • News as horizontal media list, not cards
   • Team/portfolio as a dense data table
   • Contact as split form + mono info panel
   ===================================================================== */
function V1Template() {
  const { t, lang } = useI18n();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    let alive = true;
    getAllNews().then((list) => {
      if (alive) setNewsItems(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <SiteShell theme="v1">
      {/* HERO ============================================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" aria-hidden />
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center mix-blend-screen"
          style={{ backgroundImage: `url(${heroBg})` }}
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" aria-hidden />

        <div className="container-page relative grid lg:grid-cols-12 gap-10 py-20 md:py-28 lg:py-36">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 border border-border bg-surface/60 px-3 py-1 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("hero.eyebrow")}
              </span>
            </div>
            <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tighter">
              <span className="text-gradient">{t("hero.title")}</span>
            </h1>
            <p className="mt-7 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#contact" className="group inline-flex items-center gap-2 bg-gradient-brand px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider text-brand-foreground shadow-glow">
                {t("cta.start")} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#services" className="inline-flex items-center gap-2 border border-border bg-surface/40 px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider backdrop-blur hover:bg-surface">
                {t("nav.services")}
              </a>
            </div>
          </div>

          {/* Ticker panel */}
          <div className="lg:col-span-5">
            <div className="border border-border bg-surface/70 backdrop-blur shadow-elevated">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="h-2 w-2 rounded-full bg-brand" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">debugix://live</span>
              </div>
              <div className="p-5 space-y-3 font-mono text-xs">
                {[
                  { k: "uptime.30d", v: "99.984%", c: "text-brand" },
                  { k: "tx.processed.24h", v: "4.21M", c: "text-foreground" },
                  { k: "incidents.open", v: "0", c: "text-brand" },
                  { k: "p99.latency", v: "84ms", c: "text-foreground" },
                  { k: "deploys.this_week", v: "23", c: "text-foreground" },
                ].map((r) => (
                  <div key={r.k} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0">
                    <span className="text-muted-foreground">› {r.k}</span>
                    <span className={`tabular-nums font-semibold ${r.c}`}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border px-4 py-2.5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <Activity className="h-3 w-3 text-brand" /> all systems nominal
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER BAR ====================================================== */}
      <section className="border-y border-border bg-surface/30 overflow-hidden">
        <div className="container-page py-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {[
            { v: "120+", l: t("stats.clients") },
            { v: "9", l: t("stats.years") },
            { v: "240+", l: t("stats.projects") },
            { v: "99.98%", l: t("stats.uptime") },
          ].map((s) => (
            <div key={s.l} className="px-4 md:px-6 first:pl-0 last:pr-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.l}</div>
              <div className="mt-1 font-display text-2xl md:text-4xl font-bold text-gradient tabular-nums">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT ========================================================== */}
      <section id="about" className="container-page py-24 md:py-32 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <SectionLabel index="01" label={t("about.eyebrow")} />
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">{t("about.title")}</h2>
        </div>
        <div className="lg:col-span-7 lg:pt-16">
          <p className="text-lg leading-relaxed text-muted-foreground">{t("about.body")}</p>
          <div className="mt-8 grid sm:grid-cols-3 gap-px bg-border">
            {["Senior by default", "Documentation-first", "Long-term partners"].map((c, i) => (
              <div key={c} className="bg-background p-5">
                <div className="font-mono text-[11px] text-brand">0{i + 1}</div>
                <div className="mt-2 font-semibold">{c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES ======================================================= */}
      <section id="services" className="border-t border-border bg-surface/30">
        <div className="container-page py-24 md:py-32">
          <SectionLabel index="02" label={t("services.eyebrow")} />
          <h2 className="mt-4 max-w-2xl text-4xl md:text-5xl font-bold tracking-tight">{t("services.title")}</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">{t("services.subtitle")}</p>

          <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Code2, t: "services.s1.title", d: "services.s1.desc" },
              { icon: Wallet, t: "services.s2.title", d: "services.s2.desc" },
              { icon: Plug, t: "services.s3.title", d: "services.s3.desc" },
              { icon: LifeBuoy, t: "services.s4.title", d: "services.s4.desc" },
              { icon: ShieldCheck, t: "services.s5.title", d: "services.s5.desc" },
              { icon: Cloud, t: "services.s6.title", d: "services.s6.desc" },
            ].map(({ icon: Icon, t: tk, d }, i) => (
              <article key={tk} className="group relative bg-background p-7 transition-colors hover:bg-surface">
                <div className="flex items-start justify-between">
                  <div className="grid h-11 w-11 place-items-center border border-border text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">[{String(i).padStart(2, "0")}]</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{t(tk)}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(d)}</p>
                <div className="mt-5 h-px w-8 bg-brand transition-all group-hover:w-full" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS — horizontal media rows ==================================== */}
      <section id="news" className="container-page py-24 md:py-32">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <SectionLabel index="03" label={t("news.eyebrow")} />
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">{t("news.title")}</h2>
          </div>
          <Link to="/news" className="font-mono text-xs uppercase tracking-wider text-brand hover:gap-3 inline-flex items-center gap-2">
            {t("cta.viewAll")} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {newsItems.slice(0, 3).map((n, i) => (
            <Link
              key={n.slug}
              to="/news/$slug"
              params={{ slug: n.slug }}
              className="group grid md:grid-cols-12 gap-6 py-6 items-center hover:bg-surface/40 transition-colors px-2 md:px-4 -mx-2 md:-mx-4"
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
                <h3 className="mt-2 text-xl md:text-2xl font-semibold leading-snug group-hover:text-brand transition-colors">
                  {n.title[lang]}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{n.excerpt[lang]}</p>
              </div>
              <div className="md:col-span-2 flex md:justify-end">
                <span className="inline-flex items-center gap-2 font-mono text-xs text-brand">
                  {t("cta.readMore")} <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TEAM — people & stats ========================================== */}
      <section id="team" className="border-t border-border bg-surface/30">
        <div className="container-page py-24 md:py-32 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <SectionLabel index="04" label={t("team.eyebrow")} />
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">{t("team.title")}</h2>
            <p className="mt-5 text-muted-foreground">{t("team.body")}</p>
            <div className="mt-8 grid grid-cols-2 gap-px bg-border">
              {[
                { v: "18", l: t("team.size") },
                { v: "9", l: t("team.seniors") },
                { v: "12", l: t("team.industries") },
                { v: "6", l: t("team.languages") },
                { v: "92%", l: t("team.retention") },
                { v: "24/7", l: t("team.coverage") },
              ].map((s) => (
                <div key={s.l} className="bg-background p-4">
                  <div className="font-display text-2xl md:text-3xl font-bold text-gradient tabular-nums">{s.v}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="border border-border bg-background overflow-hidden">
              <div className="grid grid-cols-12 border-b border-border bg-surface px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="col-span-1">#</span>
                <span className="col-span-4">{t("team.col.name")}</span>
                <span className="col-span-4">{t("team.col.role")}</span>
                <span className="col-span-3 text-right">{t("team.col.tenure")}</span>
              </div>
              {[
                ["Jānis Bērziņš", t("team.role.cto"), "9y"],
                ["Anna Kalniņa", t("team.role.lead"), "7y"],
                ["Edgars Ozols", t("team.role.backend"), "6y"],
                ["Līga Liepa", t("team.role.frontend"), "5y"],
                ["Mārtiņš Krūmiņš", t("team.role.devops"), "5y"],
                ["Sofia Petrova", t("team.role.design"), "4y"],
                ["Roberts Vītols", t("team.role.qa"), "4y"],
                ["Elīna Zariņa", t("team.role.pm"), "3y"],
              ].map((row, i) => (
                <div key={row[0]} className="grid grid-cols-12 px-5 py-4 border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                  <span className="col-span-1 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="col-span-4 font-semibold">{row[0]}</span>
                  <span className="col-span-4 text-sm text-muted-foreground">{row[1]}</span>
                  <span className="col-span-3 text-right font-mono text-sm tabular-nums text-brand">{row[2]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT ======================================================== */}
      <section id="contact" className="container-page py-24 md:py-32">
        <SectionLabel index="05" label={t("contact.eyebrow")} />
        <h2 className="mt-4 max-w-2xl text-4xl md:text-5xl font-bold tracking-tight">{t("contact.title")}</h2>
        <p className="mt-4 max-w-xl text-muted-foreground">{t("contact.subtitle")}</p>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          <InfoRow icon={MapPin} label={t("contact.address")} value="Brīvības iela 100, Rīga, LV-1001" />
          <InfoRow icon={Mail} label={t("contact.email")} value="hello@debugix.lv" href="mailto:hello@debugix.lv" />
          <InfoRow icon={Phone} label={t("contact.phone")} value="+371 2000 0000" href="tel:+37120000000" />
        </div>
      </section>
    </SiteShell>
  );
}

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-3">
      <span className="font-mono text-xs text-brand">[{index}]</span>
      <span className="h-px w-10 bg-brand" />
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, href }: { icon: React.ElementType; label: string; value: string; href?: string }) {
  const c = (
    <div className="flex items-start gap-4 border border-border bg-surface p-5">
      <div className="grid h-10 w-10 shrink-0 place-items-center border border-border text-brand">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-1 font-medium">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block hover:opacity-90">{c}</a> : c;
}


function fmtDate(iso: string, lang: "en" | "lv") {
  return new Date(iso).toLocaleDateString(lang === "lv" ? "lv-LV" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
}
