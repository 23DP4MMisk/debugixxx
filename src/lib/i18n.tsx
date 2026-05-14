import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "lv";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.about": "About",
  "nav.services": "Services",
  "nav.news": "News",
  "nav.team": "Team & Portfolio",
  "nav.contact": "Contact",
  
  "cta.start": "Start a project",
  "cta.contact": "Contact us",
  "cta.readMore": "Read more",
  "cta.viewAll": "View all news",
  "cta.send": "Send message",

  "hero.eyebrow": "Financial software & support",
  "hero.title": "Engineering trust into every transaction.",
  "hero.subtitle":
    "Debugix builds, maintains and scales financial applications and websites for fintech teams across the Baltics and Europe.",

  "about.eyebrow": "About Debugix",
  "about.title": "A focused team for serious financial software.",
  "about.body":
    "We design, build and support financial platforms — from customer portals to internal trading tools. Our engineers combine product thinking with disciplined delivery, so your roadmap stays predictable and your systems stay online.",
  "stats.clients": "Clients served",
  "stats.years": "Years of experience",
  "stats.projects": "Projects delivered",
  "stats.uptime": "Average uptime",

  "services.eyebrow": "What we do",
  "services.title": "Services built for financial teams.",
  "services.subtitle": "End-to-end product engineering and ongoing technical support.",
  "services.s1.title": "Web platforms",
  "services.s1.desc": "Customer portals, marketing sites and dashboards built for trust and speed.",
  "services.s2.title": "Financial applications",
  "services.s2.desc": "Custom internal tools, ledgers, billing and reporting tailored to your workflows.",
  "services.s3.title": "Integrations & APIs",
  "services.s3.desc": "Banking, KYC, payments and data providers — connected, monitored and reliable.",
  "services.s4.title": "Maintenance & support",
  "services.s4.desc": "SLA-backed support, monitoring and incident response by the team that built it.",
  "services.s5.title": "Compliance-ready delivery",
  "services.s5.desc": "Audit trails, role-based access and documentation aligned with EU regulations.",
  "services.s6.title": "Cloud & DevOps",
  "services.s6.desc": "Secure cloud infrastructure, CI/CD pipelines and observability from day one.",

  "news.eyebrow": "News & insights",
  "news.title": "From the Debugix team.",
  "news.subtitle": "Product updates, engineering notes and industry perspectives.",
  "news.minRead": "min read",
  "news.back": "Back to news",
  "news.published": "Published",
  "news.delete": "Delete",
  "news.addNews": "Add news",
  "news.logout": "Logout",

  "confirm.heading": "Confirm delete",
  "confirm.title": "Are you sure you want to delete this article?",
  "confirm.body": "\"{title}\" will be removed for everyone. This cannot be undone.",
  "confirm.cancel": "Cancel",
  "confirm.delete": "Delete",
  "confirm.deleteArticle": "Delete article",

  "admin.lang.en": "English version",
  "admin.lang.lv": "Latvian version",
  "admin.field.title": "Title",
  "admin.field.desc": "Short description",
  "admin.field.body": "Full article text",
  "admin.fillOne": "Fill at least one language. Empty fields will reuse the other language.",

  "team.eyebrow": "Our team",
  "team.title": "The people behind Debugix.",
  "team.body":
    "A senior, multidisciplinary team of engineers, designers and product specialists. Most of us have worked together for 5+ years across banking, payments and fintech.",
  "team.size": "Team members",
  "team.delivered": "Projects shipped",
  "team.industries": "Industries served",
  "team.seniors": "Senior engineers",
  "team.languages": "Languages spoken",
  "team.retention": "Team retention",
  "team.coverage": "Support coverage",
  "team.col.name": "Name",
  "team.col.role": "Role",
  "team.col.tenure": "With us",
  "team.role.cto": "Co-founder · CTO",
  "team.role.lead": "Engineering lead",
  "team.role.backend": "Senior backend engineer",
  "team.role.frontend": "Senior frontend engineer",
  "team.role.devops": "DevOps & SRE",
  "team.role.design": "Product designer",
  "team.role.qa": "QA & automation",
  "team.role.pm": "Product manager",
  "portfolio.title": "Selected work",

  "contact.eyebrow": "Contact",
  "contact.title": "Let's talk about your project.",
  "contact.subtitle": "Reach out by email or phone — we reply within one business day.",
  "contact.address": "Office",
  "contact.email": "Email",
  "contact.phone": "Phone",
  "contact.hours": "Working hours",
  "contact.hoursTitle": "When we're online",
  "contact.closed": "closed",
  "contact.responseNote": "avg. first response · under 4h",
  "contact.legal": "Legal information",
  "contact.legalBody":
    "Debugix SIA · Registered in Riga, Latvia. All services governed by Latvian and EU law.",

  "footer.tagline": "Financial software, engineered with care.",
  "footer.product": "Product",
  "footer.company": "Company",
  "footer.legal": "Legal",
  "footer.privacy": "Privacy policy",
  "footer.terms": "Terms of service",
  "footer.cookies": "Cookies",
  "footer.rights": "All rights reserved.",

};

const lv: Dict = {
  "nav.home": "Sākums",
  "nav.about": "Par mums",
  "nav.services": "Pakalpojumi",
  "nav.news": "Jaunumi",
  "nav.team": "Komanda",
  "nav.contact": "Kontakti",
  
  "cta.start": "Sākt projektu",
  "cta.contact": "Sazināties",
  "cta.readMore": "Lasīt vairāk",
  "cta.viewAll": "Visi jaunumi",
  "cta.send": "Nosūtīt ziņu",

  "hero.eyebrow": "Finanšu programmatūra un atbalsts",
  "hero.title": "Uzticamība katrā darījumā.",
  "hero.subtitle":
    "Debugix izstrādā, uztur un mērogo finanšu lietotnes un mājaslapas fintech komandām Baltijā un Eiropā.",

  "about.eyebrow": "Par Debugix",
  "about.title": "Fokusēta komanda nopietnai finanšu programmatūrai.",
  "about.body":
    "Mēs projektējam, veidojam un uzturam finanšu platformas — no klientu portāliem līdz iekšējiem rīkiem. Mūsu inženieri apvieno produkta domāšanu ar disciplinētu izpildi.",
  "stats.clients": "Apkalpoti klienti",
  "stats.years": "Pieredzes gadi",
  "stats.projects": "Realizēti projekti",
  "stats.uptime": "Vidējais darbspējas laiks",

  "services.eyebrow": "Ko mēs darām",
  "services.title": "Pakalpojumi finanšu komandām.",
  "services.subtitle": "Pilna cikla produktu izstrāde un nepārtraukts tehniskais atbalsts.",
  "services.s1.title": "Web platformas",
  "services.s1.desc": "Klientu portāli, mājaslapas un paneļi, kas veidoti uzticamībai un ātrumam.",
  "services.s2.title": "Finanšu lietotnes",
  "services.s2.desc": "Iekšēji rīki, virsgrāmatas, rēķini un atskaites pēc jūsu procesiem.",
  "services.s3.title": "Integrācijas un API",
  "services.s3.desc": "Bankas, KYC, maksājumi un datu sniedzēji — savienoti un uzraudzīti.",
  "services.s4.title": "Uzturēšana un atbalsts",
  "services.s4.desc": "SLA atbalsts, monitorings un incidentu apstrāde no izstrādātāju komandas.",
  "services.s5.title": "Atbilstoša piegāde",
  "services.s5.desc": "Audita pēdas, lomu piekļuve un dokumentācija saskaņā ar ES regulām.",
  "services.s6.title": "Mākonis un DevOps",
  "services.s6.desc": "Droša mākoņa infrastruktūra, CI/CD un novērojamība no pirmās dienas.",

  "news.eyebrow": "Jaunumi un viedokļi",
  "news.title": "No Debugix komandas.",
  "news.subtitle": "Produkta atjauninājumi, inženierijas piezīmes un nozares skatījumi.",
  "news.minRead": "min lasīšana",
  "news.back": "Atpakaļ uz jaunumiem",
  "news.published": "Publicēts",
  "news.delete": "Dzēst",
  "news.addNews": "Pievienot jaunumu",
  "news.logout": "Iziet",

  "confirm.heading": "Apstipriniet dzēšanu",
  "confirm.title": "Vai tiešām vēlaties dzēst šo rakstu?",
  "confirm.body": "\"{title}\" tiks noņemts visiem. To nevar atsaukt.",
  "confirm.cancel": "Atcelt",
  "confirm.delete": "Dzēst",
  "confirm.deleteArticle": "Dzēst rakstu",

  "admin.lang.en": "Versija angļu valodā",
  "admin.lang.lv": "Versija latviešu valodā",
  "admin.field.title": "Virsraksts",
  "admin.field.desc": "Īss apraksts",
  "admin.field.body": "Pilns raksta teksts",
  "admin.fillOne": "Aizpildiet vismaz vienu valodu. Tukši lauki izmantos otru valodu.",

  "team.eyebrow": "Mūsu komanda",
  "team.title": "Cilvēki aiz Debugix.",
  "team.body": "Pieredzējuša līmeņa inženieri, dizaineri un produktu speciālisti. Lielākā daļa no mums strādā kopā jau 5+ gadus banku, maksājumu un fintech jomā.",
  "team.size": "Komandas dalībnieki",
  "team.delivered": "Realizēti projekti",
  "team.industries": "Apkalpotas nozares",
  "team.seniors": "Vecākie inženieri",
  "team.languages": "Runātās valodas",
  "team.retention": "Komandas noturība",
  "team.coverage": "Atbalsta pārklājums",
  "team.col.name": "Vārds",
  "team.col.role": "Loma",
  "team.col.tenure": "Pie mums",
  "team.role.cto": "Līdzdibinātājs · CTO",
  "team.role.lead": "Inženierijas vadītājs",
  "team.role.backend": "Vecākais backend inženieris",
  "team.role.frontend": "Vecākais frontend inženieris",
  "team.role.devops": "DevOps un SRE",
  "team.role.design": "Produkta dizainers",
  "team.role.qa": "QA un automatizācija",
  "team.role.pm": "Produkta vadītājs",
  "portfolio.title": "Atlasīti darbi",

  "contact.eyebrow": "Kontakti",
  "contact.title": "Parunāsim par jūsu projektu.",
  "contact.subtitle": "Sazinieties pa e-pastu vai tālruni — atbildam vienas darba dienas laikā.",
  "contact.address": "Birojs",
  "contact.email": "E-pasts",
  "contact.phone": "Tālrunis",
  "contact.hours": "Darba laiks",
  "contact.hoursTitle": "Kad esam tiešsaistē",
  "contact.closed": "slēgts",
  "contact.responseNote": "vid. pirmā atbilde · zem 4h",
  "contact.legal": "Juridiskā informācija",
  "contact.legalBody":
    "Debugix SIA · Reģistrēts Rīgā, Latvijā. Visi pakalpojumi atbilst Latvijas un ES likumdošanai.",

  "footer.tagline": "Finanšu programmatūra, veidota ar rūpību.",
  "footer.product": "Produkts",
  "footer.company": "Uzņēmums",
  "footer.legal": "Juridiski",
  "footer.privacy": "Privātuma politika",
  "footer.terms": "Lietošanas noteikumi",
  "footer.cookies": "Sīkdatnes",
  "footer.rights": "Visas tiesības aizsargātas.",

};

const dicts: Record<Lang, Dict> = { en, lv };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("debugix-lang") as Lang | null;
    if (saved === "en" || saved === "lv") setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("debugix-lang", l);
  };

  const t = (k: string) => dicts[lang][k] ?? k;
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
