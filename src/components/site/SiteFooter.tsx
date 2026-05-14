import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-surface/50">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 font-mono text-sm font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-brand text-brand-foreground">D</span>
            <span>debugix.lv</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">{t("footer.tagline")}</p>
          <div className="mt-5 flex items-center gap-2">
            {[Github, Linkedin, Twitter, Mail].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-brand hover:border-brand transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <FooterCol title={t("footer.product")} items={[
          { href: "/#services", label: t("nav.services") },
          { href: "/#news", label: t("nav.news") },
          { href: "/#team", label: t("nav.team") },
        ]} />
        <FooterCol title={t("footer.company")} items={[
          { href: "/#about", label: t("nav.about") },
          { href: "/#contact", label: t("nav.contact") },
        ]} />
      </div>
      <div className="border-t border-border">
        <div className="container-page py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
          <p>© {year} DEBUGIX SIA · {t("footer.rights")}</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-foreground">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i.href}>
            <a href={i.href} className="text-sm text-muted-foreground hover:text-foreground">{i.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
