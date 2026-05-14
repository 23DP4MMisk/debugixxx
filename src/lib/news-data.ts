import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";

/**
 * Static news source — designed to be replaced by a CMS / database fetch.
 * The shape mirrors a typical `news` table:
 *   slug (pk), title, excerpt, body, cover_image_url, published_at, read_minutes, author
 * Components consuming this never assume a static origin; they accept NewsItem[] / NewsItem.
 */
export type NewsItem = {
  slug: string;
  title: { en: string; lv: string };
  excerpt: { en: string; lv: string };
  body: { en: string; lv: string };
  cover: string;
  publishedAt: string; // ISO
  readMinutes: number;
  author: string;
  category: { en: string; lv: string };
};

export const newsItems: NewsItem[] = [
  {
    slug: "scaling-payment-platforms-2025",
    title: {
      en: "Scaling payment platforms without scaling risk",
      lv: "Maksājumu platformu mērogošana, nepalielinot risku",
    },
    excerpt: {
      en: "How we approach observability, data integrity and on-call practice when payment volumes grow 10x.",
      lv: "Kā mēs pieejam novērojamībai, datu integritātei un dežūrai, kad maksājumu apjomi pieaug 10 reizes.",
    },
    body: {
      en: "Payment platforms break in predictable ways once volume crosses a threshold. The first warning signs are rarely dramatic: retry queues grow slowly, reconciliation reports take longer to close, and support teams begin seeing edge-case questions that were previously invisible. At that point, adding more servers is not enough — the product needs operational design.\n\nOur approach starts with idempotency at every external boundary, so a payment can be retried safely without creating duplicate charges or inconsistent ledger records. From there we separate urgent user-facing actions from slower background processes with tiered queues and clear failure states. This keeps checkout responsive while giving engineering teams room to recover from provider delays.\n\nThe most important layer is reconciliation. We design dual-write checks, daily balance validation, and exception dashboards so finance, support, and engineering all work from the same source of truth. When volumes grow 10x, trust depends less on one perfect system and more on fast detection, calm recovery, and a runbook that everyone understands.",
      lv: "Maksājumu platformas lūst paredzamā veidā, kad apjoms šķērso noteiktu slieksni. Pirmās pazīmes parasti nav dramatiskas: atkārtoto mēģinājumu rindas aug lēni, salīdzināšanas atskaites aizņem vairāk laika, un atbalsta komanda sāk redzēt robežgadījumus, kas iepriekš nebija pamanāmi. Šādā brīdī ar papildu serveriem nepietiek — produktam vajadzīga operacionāla arhitektūra.\n\nMūsu pieeja sākas ar idempotenci katrā ārējā robežā, lai maksājumu varētu droši atkārtot, neradot dubultas transakcijas vai nekonsekventus virsgrāmatas ierakstus. Pēc tam mēs nošķiram lietotājam kritiskās darbības no lēnākiem fona procesiem, izmantojot prioritāras rindas un skaidrus kļūdu stāvokļus.\n\nSvarīgākais slānis ir salīdzināšana. Mēs veidojam dubultās rakstīšanas pārbaudes, ikdienas bilances validāciju un izņēmumu paneļus, lai finanses, atbalsts un inženieri strādātu ar vienu patiesības avotu. Kad apjoms aug 10 reizes, uzticība balstās nevis uz vienu perfektu sistēmu, bet uz ātru problēmu pamanīšanu, mierīgu atjaunošanu un saprotamu rīcības plānu.",
    },
    cover: news3,
    publishedAt: "2025-03-18",
    readMinutes: 6,
    author: "Debugix Engineering",
    category: { en: "Engineering", lv: "Inženierija" },
  },
  {
    slug: "designing-trust-financial-ui",
    title: {
      en: "Designing trust into financial interfaces",
      lv: "Kā ieprojektēt uzticamību finanšu saskarnēs",
    },
    excerpt: {
      en: "Five small UI decisions that consistently move the needle on conversion in regulated financial products.",
      lv: "Piecas mazas UI izvēles, kas regulēti finanšu produktos konsekventi uzlabo konversiju.",
    },
    body: {
      en: "Trust in financial UI is built from dozens of micro-decisions that users often cannot name, but instantly feel. Confirmation patterns, number formatting, status colour, latency feedback, and the tone of error messages all shape whether a customer believes the product is safe enough for money movement.\n\nIn recent client work, the highest-impact changes were not visual redesigns. They were clearer review screens before irreversible actions, consistent currency formatting across every table and receipt, and progress states that explained what was happening instead of leaving users staring at a spinner. These small details reduced support tickets and increased completion rates.\n\nThe design process has to be measurable. For every change we define the user risk it should reduce, the metric it should move, and the failure mode it should prevent. In regulated products, trust is not decoration — it is product infrastructure.",
      lv: "Uzticamība finanšu saskarnē veidojas no desmitiem mikro-lēmumu, kurus lietotāji bieži nevar nosaukt, bet uzreiz sajūt. Apstiprinājumu plūsmas, skaitļu formatējums, statusa krāsas, ielādes atgriezeniskā saite un kļūdu tekstu tonis nosaka, vai lietotājs produktu uztver kā pietiekami drošu naudas kustībai.\n\nPēdējos klientu projektos vislielāko efektu nedeva vizuāls pārveidojums. To deva skaidrāki pārskata ekrāni pirms neatgriezeniskām darbībām, konsekvents valūtas formatējums visās tabulās un kvītīs, kā arī progresa stāvokļi, kas paskaidroja notiekošo, nevis atstāja lietotāju pie tukša ielādes indikatora.\n\nDizaina procesam jābūt izmērāmam. Katrai izmaiņai mēs definējam risku, ko tā samazina, metriku, ko tā uzlabo, un kļūdas scenāriju, ko tā novērš. Regulētos produktos uzticība nav dekorācija — tā ir produkta infrastruktūra.",
    },
    cover: news1,
    publishedAt: "2025-02-04",
    readMinutes: 4,
    author: "Debugix Design",
    category: { en: "Design", lv: "Dizains" },
  },
  {
    slug: "support-as-product",
    title: {
      en: "Treating support as a product, not a cost centre",
      lv: "Atbalsts kā produkts, nevis izmaksu centrs",
    },
    excerpt: {
      en: "Why our support engineers ship code — and what that means for the platforms we maintain.",
      lv: "Kāpēc mūsu atbalsta inženieri raksta kodu — un ko tas nozīmē uzturētajām platformām.",
    },
    body: {
      en: "Most outsourced support models separate the people who answer tickets from the people who can fix them. That split creates long feedback loops: support documents a bug, engineering investigates later, and the customer waits while context gets passed between teams. We use a different model.\n\nEvery support engineer at Debugix can read logs, reproduce issues, open pull requests, and ship small fixes. This does not mean support works without engineering standards. It means the support function is part of the product system, with review, testing, observability, and incident notes built into the same workflow as feature development.\n\nThe result is faster recovery and better products. Repeated questions become product improvements, not just knowledge-base articles. Incidents become code changes, not only apologies. When support is treated as a product capability, every ticket becomes a signal for what the platform should do better next.",
      lv: "Lielākā daļa ārpakalpojuma atbalsta modeļu atdala cilvēkus, kas atbild uz pieprasījumiem, no cilvēkiem, kas tos var salabot. Tas rada garas atgriezeniskās saites: atbalsts apraksta kļūdu, inženieri to vēlāk izmeklē, un klients gaida, kamēr konteksts tiek nodots starp komandām. Mēs izmantojam citu modeli.\n\nKatrs Debugix atbalsta inženieris var lasīt žurnālus, reproducēt problēmas, atvērt pull request un palaist nelielus labojumus. Tas nenozīmē, ka atbalsts strādā bez inženierijas standartiem. Tas nozīmē, ka atbalsts ir produkta sistēmas daļa ar pārskatīšanu, testēšanu, novērojamību un incidentu piezīmēm tajā pašā darba plūsmā kā funkciju izstrāde.\n\nRezultāts ir ātrāka atjaunošana un labāki produkti. Atkārtoti jautājumi kļūst par produkta uzlabojumiem, nevis tikai zināšanu bāzes rakstiem. Incidenti kļūst par koda izmaiņām, nevis tikai atvainošanos. Ja atbalstu uztver kā produkta spēju, katrs pieprasījums kļūst par signālu, ko platformai uzlabot tālāk.",
    },
    cover: news2,
    publishedAt: "2025-01-12",
    readMinutes: 5,
    author: "Debugix Team",
    category: { en: "Operations", lv: "Operācijas" },
  },
];

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return newsItems.find((n) => n.slug === slug);
}
