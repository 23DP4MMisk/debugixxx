import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n, type Lang } from "@/lib/i18n";

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [location.pathname]);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/#about", label: t("nav.about") },
    { to: "/#services", label: t("nav.services") },
    { to: "/#news", label: t("nav.news") },
    { to: "/#team", label: t("nav.team") },
    { to: "/#contact", label: t("nav.contact") },
  ];

  const wrap = scrolled ? "border-b border-border bg-background/85 backdrop-blur-xl" : "bg-transparent";
  const navLink = "px-3 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-brand transition-colors";

  return (
    <header className={`sticky top-0 z-40 w-full transition-all ${wrap}`}>
      <div className="container-page flex h-16 md:h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-brand text-brand-foreground font-mono text-sm shadow-glow">D</span>
          <span className="font-mono text-sm font-semibold tracking-tight">
            debugix<span className="text-brand">.</span>lv
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a key={l.to} href={l.to} className={navLink}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitch lang={lang} setLang={setLang} />
          <a href="/#contact" className="hidden md:inline-flex items-center justify-center rounded-md bg-gradient-brand px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-brand-foreground shadow-glow">
            {t("cta.contact")}
          </a>
          <button
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden grid place-items-center h-10 w-10 border border-border text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container-page flex flex-col py-3">
            {links.map((l) => (
              <a key={l.to} href={l.to} className="py-3 text-base text-foreground border-b border-border/60 last:border-0">
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function LangSwitch({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="inline-flex items-center gap-1 border border-border bg-surface/60 p-0.5" role="group" aria-label="Language">
      <Globe className="h-3.5 w-3.5 mx-1.5 text-muted-foreground" aria-hidden />
      {(["en", "lv"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider transition-colors ${
            lang === l ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
