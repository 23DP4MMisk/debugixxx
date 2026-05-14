import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { ArrowLeft, Lock, Upload, Check } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { addUserNews, slugify, isAdmin, setAdmin } from "@/lib/news-store";
import { useI18n } from "@/lib/i18n";

// ⚠️ Hardcoded admin password — only someone who knows it can publish news.
const ADMIN_PASSWORD = "debugix2025";

export const Route = createFileRoute("/admin/news")({
  head: () => ({
    meta: [
      { title: "Add news · Debugix admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminNewsPage,
});

function AdminNewsPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (isAdmin()) setAuthed(true);
  }, []);

  // Form state
  const [titleEn, setTitleEn] = useState("");
  const [titleLv, setTitleLv] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descLv, setDescLv] = useState("");
  const [bodyEn, setBodyEn] = useState("");
  const [bodyLv, setBodyLv] = useState("");
  const [coverDataUrl, setCoverDataUrl] = useState<string>("");
  const [coverName, setCoverName] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setAuthError("");
      setAdmin(true);
    } else {
      setAuthError("Incorrect password");
    }
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("Please select an image file");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setFormError("Image must be under 4 MB");
      return;
    }
    setFormError("");
    const reader = new FileReader();
    reader.onload = () => {
      setCoverDataUrl(String(reader.result || ""));
      setCoverName(file.name);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    const tEn = titleEn.trim();
    const tLv = titleLv.trim();
    const dEn = descEn.trim();
    const dLv = descLv.trim();
    const bEn = bodyEn.trim();
    const bLv = bodyLv.trim();
    // At least one full language version must be present.
    const hasEn = tEn && dEn && bEn;
    const hasLv = tLv && dLv && bLv;
    if ((!hasEn && !hasLv) || !coverDataUrl) {
      setFormError("Provide title, description, full article in at least one language, and an image.");
      return;
    }
    setSubmitting(true);
    try {
      // Fall back to the other language when one side is missing.
      const finalTitleEn = tEn || tLv;
      const finalTitleLv = tLv || tEn;
      const finalDescEn = dEn || dLv;
      const finalDescLv = dLv || dEn;
      const finalBodyEn = bEn || bLv;
      const finalBodyLv = bLv || bEn;
      const slug = `${slugify(finalTitleEn)}-${Date.now().toString(36)}`;
      const wordCount = (finalBodyEn || finalBodyLv).split(/\s+/).length;
      await addUserNews({
        slug,
        title: { en: finalTitleEn, lv: finalTitleLv },
        excerpt: { en: finalDescEn.slice(0, 220), lv: finalDescLv.slice(0, 220) },
        body: { en: finalBodyEn, lv: finalBodyLv },
        cover: coverDataUrl,
        publishedAt: new Date().toISOString(),
        readMinutes: Math.max(1, Math.round(wordCount / 200)),
        author: "Debugix Admin",
        category: { en: "News", lv: "Jaunumi" },
      });
      navigate({ to: "/news" });
    } catch (err) {
      setFormError("Failed to save. Try a smaller image.");
      setSubmitting(false);
    }
  }

  // ─────────── Login screen ───────────
  if (!authed) {
    return (
      <SiteShell theme="v1">
        <section className="container-page py-20 md:py-28">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-brand">
            <ArrowLeft className="h-4 w-4" /> Back to news
          </Link>
          <div className="mx-auto mt-10 max-w-md border border-border bg-surface/70 backdrop-blur shadow-elevated">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                <span className="h-2 w-2 rounded-full bg-brand" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">debugix://admin</span>
            </div>
            <form onSubmit={handleLogin} className="p-6 space-y-5">
              <div className="grid h-12 w-12 place-items-center border border-border text-brand">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Admin access</h1>
                <p className="mt-1 text-sm text-muted-foreground">Enter the password to publish news.</p>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="mt-2 block w-full border border-border bg-background px-3 py-3 font-mono text-sm focus:border-brand focus:outline-none"
                  placeholder="••••••••"
                />
                {authError && <p className="mt-2 font-mono text-xs text-destructive">› {authError}</p>}
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-brand px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-brand-foreground shadow-glow"
              >
                Unlock
              </button>
            </form>
          </div>
        </section>
      </SiteShell>
    );
  }

  // ─────────── Form screen ───────────
  return (
    <SiteShell theme="v1">
      <section className="container-page py-16 md:py-24">
        <Link to="/news" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-brand">
          <ArrowLeft className="h-4 w-4" /> Back to news
        </Link>

        <div className="mt-8 max-w-2xl">
          <div className="inline-flex items-center gap-3">
            <span className="font-mono text-xs text-brand">[admin]</span>
            <span className="h-px w-10 bg-brand" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Publish news</span>
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">New article</h1>
          <p className="mt-3 text-muted-foreground">Attach an image, write a short description and the full article text. The article will appear at the top of the news list.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 max-w-2xl space-y-6">
          <p className="font-mono text-[11px] text-muted-foreground">{t("admin.fillOne")}</p>

          {/* English version */}
          <fieldset className="border border-border p-5 space-y-5">
            <legend className="px-2 font-mono text-[10px] uppercase tracking-wider text-brand">EN · {t("admin.lang.en")}</legend>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t("admin.field.title")}</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                maxLength={140}
                className="mt-2 block w-full border border-border bg-background px-3 py-3 text-base focus:border-brand focus:outline-none"
                placeholder="Article title"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t("admin.field.desc")}</label>
              <textarea
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                rows={3}
                maxLength={300}
                className="mt-2 block w-full border border-border bg-background px-3 py-3 text-base focus:border-brand focus:outline-none resize-y"
                placeholder="Short text for the news list…"
              />
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">{descEn.length} / 300</p>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t("admin.field.body")}</label>
              <textarea
                value={bodyEn}
                onChange={(e) => setBodyEn(e.target.value)}
                rows={10}
                maxLength={12000}
                className="mt-2 block w-full border border-border bg-background px-3 py-3 text-base focus:border-brand focus:outline-none resize-y"
                placeholder="Write the full article here…"
              />
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">{bodyEn.length} / 12000</p>
            </div>
          </fieldset>

          {/* Latvian version */}
          <fieldset className="border border-border p-5 space-y-5">
            <legend className="px-2 font-mono text-[10px] uppercase tracking-wider text-brand">LV · {t("admin.lang.lv")}</legend>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t("admin.field.title")}</label>
              <input
                type="text"
                value={titleLv}
                onChange={(e) => setTitleLv(e.target.value)}
                maxLength={140}
                className="mt-2 block w-full border border-border bg-background px-3 py-3 text-base focus:border-brand focus:outline-none"
                placeholder="Raksta virsraksts"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t("admin.field.desc")}</label>
              <textarea
                value={descLv}
                onChange={(e) => setDescLv(e.target.value)}
                rows={3}
                maxLength={300}
                className="mt-2 block w-full border border-border bg-background px-3 py-3 text-base focus:border-brand focus:outline-none resize-y"
                placeholder="Īss teksts jaunumu sarakstam…"
              />
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">{descLv.length} / 300</p>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t("admin.field.body")}</label>
              <textarea
                value={bodyLv}
                onChange={(e) => setBodyLv(e.target.value)}
                rows={10}
                maxLength={12000}
                className="mt-2 block w-full border border-border bg-background px-3 py-3 text-base focus:border-brand focus:outline-none resize-y"
                placeholder="Ierakstiet šeit pilnu rakstu…"
              />
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">{bodyLv.length} / 12000</p>
            </div>
          </fieldset>

          {/* Image upload */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Cover image</label>
            <label className="mt-2 flex cursor-pointer items-center gap-3 border border-dashed border-border bg-surface/40 px-4 py-6 hover:border-brand">
              <div className="grid h-10 w-10 place-items-center border border-border text-brand">
                {coverDataUrl ? <Check className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{coverName || "Choose an image from your computer"}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">PNG · JPG · max 4MB</div>
              </div>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
            {coverDataUrl && (
              <div className="mt-3 aspect-[16/9] overflow-hidden border border-border">
                <img src={coverDataUrl} alt="preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          {formError && <p className="font-mono text-xs text-destructive">› {formError}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-gradient-brand px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider text-brand-foreground shadow-glow disabled:opacity-50"
            >
              {submitting ? "Publishing…" : "Publish article"}
            </button>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 border border-border bg-surface/40 px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider hover:bg-surface"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </SiteShell>
  );
}
