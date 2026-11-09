// Lilium House 2.0 — static build for Hostinger (no runtime dependencies).
// node build.mjs  ->  dist/ (contents of public_html) + liliumhouse-hostinger.zip
// Preview: SITE_URL=https://liliumhouse.miximcreativestudio.com STAGING=1 node build.mjs
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");
const STAGING = process.env.STAGING === "1";
const config = JSON.parse(fs.readFileSync(path.join(SRC, "config.json"), "utf8"));
if (process.env.SITE_URL) config.siteUrl = process.env.SITE_URL.replace(/\/$/, "");
const manifest = JSON.parse(fs.readFileSync(path.join(SRC, "assets/img/manifest.json"), "utf8"));
const dict = { en: JSON.parse(fs.readFileSync(path.join(SRC, "i18n/en.json"), "utf8")), it: JSON.parse(fs.readFileSync(path.join(SRC, "i18n/it.json"), "utf8")) };
const V = Date.now().toString(36).slice(-6);

// ---------- Routes ----------
const ROUTES = {
  home: { en: "/", it: "/it/" },
  rome: { en: "/rome/", it: "/it/roma/" },
  crete: { en: "/crete/", it: "/it/creta/" },
  about: { en: "/about/", it: "/it/chi-siamo/" },
  contact: { en: "/contact/", it: "/it/contatti/" },
  privacy: { en: "/privacy-policy/", it: "/it/privacy-policy/" },
  cookies: { en: "/cookie-policy/", it: "/it/cookie-policy/" },
};
const PAGES = [
  { id: "home", file: "home" },
  { id: "rome", file: "location", loc: "rome" },
  { id: "crete", file: "location", loc: "crete" },
  { id: "about", file: "about" },
  { id: "contact", file: "contact" },
  { id: "privacy", file: "privacy-policy", perLang: true },
  { id: "cookies", file: "cookie-policy", perLang: true },
];
const LOC = {
  rome: {
    meta: { titleKey: "rome.metaTitle", descKey: "rome.metaDescription", bodyClass: "page-location page-rome", headerTheme: "dark", ogImage: "rome-skyline", wa: "rome", bookHome: "rome" },
    heroImg: "rome-skyline", heroAlt: "Rome skyline at sunset", nextImg: "crete-living-room", nextAlt: "Lilium House Crete, living room", next: "crete",
    rooms: [["rome-bathroom"], ["rome-room-garden"], ["rome-living-blue"], ["rome-kitchenette"]],
    roomPool: ["rome-bathroom", "rome-room-garden", "rome-living-blue", "rome-kitchenette", "rome-bedroom", "rome-bedroom-double"],
    exp: ["rome-colosseum", "rome-vatican", "rome-san-saba", "rome-aventino-street", "rome-rooftops", "rome-dome-keyhole"],
  },
  crete: {
    meta: { titleKey: "crete.metaTitle", descKey: "crete.metaDescription", bodyClass: "page-location page-crete", headerTheme: "dark", ogImage: "crete-harbour", wa: "crete", bookHome: "crete" },
    heroImg: "crete-harbour", heroAlt: "Harbour town in eastern Crete", nextImg: "crete-dining", nextAlt: "Lilium House Crete, dining area", next: "about",
    rooms: [["crete-bedroom"], ["crete-daybed"], ["crete-bathroom"]],
    roomPool: ["crete-bedroom", "crete-daybed", "crete-bathroom", "crete-living-room", "crete-dining"],
    exp: ["crete-taverna", "island-seafront", "crete-beach", "crete-sunset", "crete-coast-road", "crete-village"],
  },
};

// ---------- Icons (1.5 stroke, line style) ----------
const I = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const icons = {
  arrow: I('<path d="M5 12h14M13 6l6 6-6 6"/>', 'class="arrow"'),
  "arrow-down": I('<path d="M12 5v14M6 13l6 6 6-6"/>'),
  "arrow-up-right": I('<path d="M7 17L17 7M8 7h9v9"/>'),
  "chev-left": I('<path d="M15 18l-6-6 6-6"/>'),
  "chev-right": I('<path d="M9 18l6-6-6-6"/>'),
  calendar: I('<rect x="3.5" y="5" width="17" height="15.5" rx="1"/><path d="M8 3v4M16 3v4M3.5 10h17"/>'),
  pin: I('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  phone: I('<path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 6.9 6.9l1.3-2 4 1.6V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm0-21.6A11.8 11.8 0 0 0 1.9 18l-1.7 6 6.2-1.6A11.8 11.8 0 1 0 12 .2z"/></svg>`,
  close: I('<path d="M6 6l12 12M18 6L6 18"/>'),
  star: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.4L12 17.4l-5.7 3 1.1-6.4-4.6-4.5 6.4-.9z"/></svg>`,
  cookie: I('<path d="M20.5 12.5A8.5 8.5 0 1 1 11.5 3.5a3 3 0 0 0 4 4 3 3 0 0 0 5 5z"/><path d="M8.5 9.5h.01M15 15.5h.01M9 15h.01M12 12.5h.01"/>'),
  globe: I('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>'),
  home: I('<path d="M4 10.5L12 4l8 6.5V20H4z"/><path d="M9.5 20v-5.5h5V20"/>'),
  sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>'),
  leaf: I('<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19l7-7"/>'),
  compass: I('<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
  key: I('<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>'),
  hourglass: I('<path d="M6.5 3.5h11M6.5 20.5h11M7.5 3.5c0 5 9 5 9 8.5s-9 3.5-9 8.5M16.5 3.5c0 5-9 5-9 8.5s9 3.5 9 8.5"/>'),
  lock: I('<rect x="5" y="10.5" width="14" height="10" rx="1"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
  users: I('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.4-3.5 2.8-5.5 6-5.5s5.6 2 6 5.5"/><path d="M15.5 4.8a3.2 3.2 0 0 1 0 6.4M17.5 14.7c2 .6 3.2 2.4 3.5 5.3"/>'),
  bed: I('<path d="M3 18.5V6M3 14h18v4.5M21 14v-2.5a3 3 0 0 0-3-3h-7V14"/><circle cx="7" cy="11" r="1.8"/>'),
  wave: I('<path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>'),
  check: I('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  google: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z"/></svg>`,
};

// ---------- Responsive images ----------
function img(name, alt = "", sizes = "100vw", cls = "", eager = "") {
  const m = manifest[name];
  if (!m) throw new Error(`Image missing from manifest: ${name}`);
  const srcset = m.widths.map((w) => `/assets/img/${name}-${w}.webp ${w}w`).join(", ");
  const def = m.widths.includes(1280) ? 1280 : m.widths[m.widths.length - 1];
  const loading = eager === "eager" ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  return `<img src="/assets/img/${name}-${def}.webp" srcset="${srcset}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${alt}" ${loading} decoding="async"${cls ? ` class="${cls}"` : ""}>`;
}

// ---------- Data blocks ----------
const pad = (n) => String(n).padStart(2, "0");
const blocks = {
  features: (t) => `<div class="features" data-stagger>${t.features.map((f, i) => `
      <article class="feature"><span class="feature__num">${pad(i + 1)}</span><span class="feature__icon">${icons[f.icon]}</span><h3>${f.title}</h3><p>${f.text}</p></article>`).join("")}
    </div>`,
  philosophy: (t) => `<ol class="philosophy__list">${t.about.philosophy.map((p, i) => `<li data-reveal data-delay="${(i * 0.06).toFixed(2)}"><span>${pad(i + 1)}</span>${p}</li>`).join("")}</ol>`,
  checkin: (t) => `<ul class="check-list">${t.about.checkin.map((c) => `<li>${c}</li>`).join("")}</ul>`,
  facts: (t, ctx) => `<ul class="facts">${t[ctx.loc].facts.map((f) => `<li>${f}</li>`).join("")}</ul>`,
  rooms: (t, ctx) => {
    const L = LOC[ctx.loc];
    return `<div class="rooms rooms--${t.rooms[ctx.loc].length}" data-stagger>${t.rooms[ctx.loc].map((r, i) => {
      const own = L.rooms[i][0];
      const pics = [own, ...L.roomPool.filter((p) => p !== own)];
      const sizes = t.rooms[ctx.loc].length === 3 ? "(min-width:1100px) 32vw, (min-width:720px) 50vw, 100vw" : "(min-width:720px) 48vw, 100vw";
      const figs = pics.map((p, k) => `<figure class="${k === 0 ? "is-active" : ""}">${img(p, `${r.name} — ${t.ui.photo} ${k + 1}`, sizes)}</figure>`).join("");
      return `
      <article class="room">
        <div class="room__gallery" data-gallery>
          <div class="room__frame">${figs}
            <span class="room__count">01 / ${pad(pics.length)}</span>
            <button type="button" class="room__nav room__nav--prev" data-gprev aria-label="${t.ui.prev}">${icons["chev-left"]}</button>
            <button type="button" class="room__nav room__nav--next" data-gnext aria-label="${t.ui.next}">${icons["chev-right"]}</button>
          </div>
        </div>
        <div class="room__body">
          <h3>${r.name}</h3>
          <p>${r.text}</p>
          <ul class="room__meta"><li>${icons.users}${r.guests}</li><li>${icons.bed}${r.bed}</li></ul>
        </div>
      </article>`;
    }).join("")}
    </div>`;
  },
  experiences: (t, ctx) => {
    const L = LOC[ctx.loc];
    return `<div class="carousel" data-reveal>
      <div class="carousel__track" tabindex="0">${t.experiences[ctx.loc].map((e, i) => `
        <article class="exp">
          <figure class="media media--exp">${img(L.exp[i], e.title, "(min-width:1024px) 34vw, 82vw")}<span class="exp__num">${pad(i + 1)}</span></figure>
          <h3>${e.title}</h3>
          <p>${e.text}</p>
        </article>`).join("")}
      </div>
      <div class="carousel__ui"><div class="carousel__progress"><i></i></div><div class="carousel__btns"><button type="button" class="round-btn" data-prev aria-label="${t.ui.prev}">${icons["chev-left"]}</button><button type="button" class="round-btn" data-next aria-label="${t.ui.next}">${icons["chev-right"]}</button></div></div>
    </div>`;
  },
  pricing: (t, ctx) => priceCards(t, ctx.loc),
  pricingBoth: (t) => `<div class="price-both">${["rome", "crete"].map((loc) => `<div class="price-both__col"><h4 class="price-both__label"><i class="dot dot--${loc}"></i>${t.pricing[loc].label}</h4>${priceCards(t, loc, true)}</div>`).join("")}</div>`,
  extraCta: (t, ctx) => ctx.loc === "crete" ? `<div class="center" style="margin-top:40px" data-reveal><a class="btn btn--line" href="${ctx.waLink}" target="_blank" rel="noopener">${icons.whatsapp} ${t.crete.moreInfo}</a></div>` : "",
};
function priceCards(t, loc, compact = false) {
  const p = t.pricing[loc];
  const card = (col, name, dates, hi) => `
      <article class="price${hi ? " price--high" : ""}"${compact ? "" : " data-reveal"}>
        <header><h3>${name}</h3><p>${dates}</p></header>
        <dl>${p.rows.map((r) => `<div><dt>${r[0]}</dt><dd>${r[col]}</dd></div>`).join("")}</dl>
      </article>`;
  return `<div class="prices${compact ? " prices--compact" : ""}">${card(1, t.pricing.high, p.highDates, true)}${card(2, t.pricing.low, p.lowDates, false)}</div>
    <p class="price-note">${t.pricing.note}</p>`;
}

// ---------- Template engine ----------
const partial = (n) => fs.readFileSync(path.join(SRC, "partials", n + ".html"), "utf8");
const vars = (tpl, ctx) => tpl.replace(/\{\{([\w.]+)\}\}/g, (m, k) => (k in ctx ? ctx[k] : m));
function render(tpl, ctx, t, depth = 0) {
  if (depth > 10) throw new Error("Includes nested too deep");
  tpl = tpl.replace(/\{\{>\s*([\w-]+)(?::([\w-]+))?\s*\}\}/g, (_, n, p) => render(partial(n).replace(/__P__/g, p || "f"), ctx, t, depth + 1));
  tpl = vars(tpl, ctx);
  tpl = tpl.replace(/\{\{img\s+([^}]+)\}\}/g, (_, args) => img(...args.split("|").map((s) => s.trim())));
  tpl = tpl.replace(/\{\{icon\s+([\w-]+)\}\}/g, (_, n) => { if (!icons[n]) throw new Error("Icon missing: " + n); return icons[n]; });
  tpl = tpl.replace(/\{\{(features|philosophy|checkin|facts|rooms|experiences|pricing|pricingBoth|extraCta)\}\}/g, (_, n) => blocks[n](t, ctx));
  return vars(vars(tpl, ctx), ctx);
}
function flatten(obj, prefix, out) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix + k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key + ".", out);
    else if (typeof v === "string") out[key] = v;
  }
  return out;
}
const get = (o, p) => p.split(".").reduce((a, k) => a && a[k], o);
const strip = (s) => s.replace(/<[^>]+>/g, "");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

// ---------- JSON-LD ----------
function jsonld(lang) {
  const t = dict[lang];
  const base = { telephone: config.phone, priceRange: "€40 – €100", image: `${config.siteUrl}/assets/img/rome-living-room-1113.webp` };
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${config.siteUrl}/#org`, name: "Lilium House", url: config.siteUrl + "/", logo: `${config.siteUrl}/assets/img/apple-touch-icon.png`, telephone: config.phone },
      { "@type": "LodgingBusiness", "@id": `${config.siteUrl}/#rome`, name: "Lilium House Rome", url: config.siteUrl + ROUTES.rome[lang], description: strip(t.rome.metaDescription), ...base, priceRange: "€75 – €100",
        address: { "@type": "PostalAddress", streetAddress: "Viale Giotto", addressLocality: "Roma", addressRegion: "RM", addressCountry: "IT" },
        geo: { "@type": "GeoCoordinates", latitude: Number(config.romeLat), longitude: Number(config.romeLng) }, hasMap: config.romeMapsUrl, parentOrganization: { "@id": `${config.siteUrl}/#org` } },
      { "@type": "LodgingBusiness", "@id": `${config.siteUrl}/#crete`, name: "Lilium House Crete", url: config.siteUrl + ROUTES.crete[lang], description: strip(t.crete.metaDescription), ...base, priceRange: "€40 – €100",
        address: { "@type": "PostalAddress", addressLocality: "Palekastro", addressRegion: "Crete", addressCountry: "GR" }, parentOrganization: { "@id": `${config.siteUrl}/#org` } },
    ],
  }).replace(/</g, "\\u003c");
}

// ---------- Build ----------
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const qrSvg = await QRCode.toString(config.googleReviewWriteUrl, { type: "svg", margin: 0, color: { dark: "#1c1917", light: "#ffffff" }, errorCorrectionLevel: "M" });
const qrInline = qrSvg.replace("<svg ", '<svg role="img" aria-label="QR code — Google review" ');
const sitemap = [];

function buildPage(page, lang) {
  const t = dict[lang];
  const other = lang === "en" ? "it" : "en";
  const isLoc = !!page.loc;
  const srcFile = page.perLang ? `${page.file}.${lang}` : page.file;
  const raw = fs.readFileSync(path.join(SRC, "pages", srcFile + ".html"), "utf8");
  const metaMatch = raw.match(/^<!--meta\s+([\s\S]*?)-->/);
  const meta = isLoc ? LOC[page.loc].meta : metaMatch ? JSON.parse(metaMatch[1]) : {};
  const body = raw.replace(/^<!--meta[\s\S]*?-->\s*/, "");
  const route = page.route || ROUTES[page.id][lang];
  const ctx = { ...config, ...flatten(t, "t.", {}), lang, locale: t.locale, v: V, qr: qrInline, loc: page.loc || "" };
  for (const [k, r] of Object.entries(ROUTES)) ctx["u." + k] = r[lang];
  if (isLoc) {
    Object.assign(ctx, flatten(t[page.loc], "L.", {}));
    const L = LOC[page.loc];
    Object.assign(ctx, { heroImg: L.heroImg, heroAlt: L.heroAlt, nextImg: L.nextImg, nextAlt: L.nextAlt, nextUrl: ROUTES[L.next][lang] });
  }
  ctx.title = esc(strip(meta.titleKey ? get(t, meta.titleKey) : meta.title));
  ctx.description = esc(strip(meta.descKey ? get(t, meta.descKey) : meta.description || t.home.metaDescription));
  ctx.bodyClass = meta.bodyClass || "";
  ctx.headerTheme = meta.headerTheme || "dark";
  ctx.ogImage = meta.ogImage || "rome-living-room";
  ctx.bookHome = meta.bookHome || "";
  ctx.waLink = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(t.wa[meta.wa || "generic"])}`;
  ctx.canonical = config.siteUrl + (page.id === "404" ? ROUTES.home[lang] : route);
  ctx.robots = STAGING || page.noindex ? "noindex, nofollow" : "index, follow";
  ctx.altLang = other;
  ctx.altUrl = page.id === "404" ? ROUTES.home[other] : ROUTES[page.id][other];
  ctx.hreflang = page.id === "404" ? "" : ["en", "it"].map((l) => `<link rel="alternate" hreflang="${l}" href="${config.siteUrl}${ROUTES[page.id][l]}">`).join("\n") + `\n<link rel="alternate" hreflang="x-default" href="${config.siteUrl}${ROUTES[page.id].en}">`;
  ctx.jsonld = jsonld(lang);
  ctx.jsI18n = JSON.stringify({ sending: t.booking.sending, required: t.booking.required, ok: t.booking.ok, fail: t.booking.fail, failOr: t.booking.failOr, waMsg: t.booking.waMsg, homes: { rome: t.booking.homeRome, crete: t.booking.homeCrete, any: t.booking.homeAny, "": t.booking.homeAny }, wa: t.wa, open: t.nav.openMenu, close: t.nav.closeMenu, customize: t.cookie.customize, save: t.cookie.save }).replace(/&/g, "&amp;").replace(/'/g, "&#39;");
  const navItem = (id, cls = "") => `<li><a href="${ROUTES[id][lang]}"${ROUTES[id][lang] === route ? ' aria-current="page"' : ""}${cls}>${t.nav[id]}</a></li>`;
  ctx.navLeft = ["home", "rome", "crete"].map((id) => navItem(id)).join("");
  ctx.navRight = ["about", "contact"].map((id) => navItem(id)).join("");
  ctx.menuLinks = ["home", "rome", "crete", "about", "contact"].map((id, i) => `<li><a href="${ROUTES[id][lang]}"${ROUTES[id][lang] === route ? ' aria-current="page"' : ""}><small>${pad(i + 1)}</small>${t.nav[id]}</a></li>`).join("");
  ctx.footerLinks = ["home", "rome", "crete", "about", "contact"].map((id) => navItem(id)).join("");

  ctx.content = render(body, ctx, t);
  const html = render(partial("layout"), ctx, t);
  const leftover = html.match(/\{\{[^}]+\}\}/g);
  if (leftover) throw new Error(`Unresolved placeholders in ${srcFile} (${lang}): ${[...new Set(leftover)].join(", ")}`);
  const out = route.endsWith(".html") ? path.join(DIST, route) : path.join(DIST, route, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  if (page.id !== "404") sitemap.push({ id: page.id, lang });
  console.log("✓", route);
}

for (const lang of ["en", "it"]) for (const p of PAGES) buildPage(p, lang);
buildPage({ id: "404", file: "404", route: "/404.html", noindex: true }, "en");

// ---------- Assets ----------
const cp = (a, b) => { fs.mkdirSync(path.dirname(b), { recursive: true }); fs.cpSync(a, b, { recursive: true }); };
cp(path.join(SRC, "assets/css"), path.join(DIST, "assets/css"));
cp(path.join(SRC, "assets/js"), path.join(DIST, "assets/js"));
for (const f of fs.readdirSync(path.join(SRC, "assets/img"))) if (/\.(webp|png|svg)$/.test(f)) cp(path.join(SRC, "assets/img", f), path.join(DIST, "assets/img", f));
const NM = path.join(ROOT, "node_modules");
cp(path.join(NM, "lenis/dist/lenis.min.js"), path.join(DIST, "assets/vendor/lenis.min.js"));
cp(path.join(NM, "gsap/dist/gsap.min.js"), path.join(DIST, "assets/vendor/gsap.min.js"));
cp(path.join(NM, "gsap/dist/ScrollTrigger.min.js"), path.join(DIST, "assets/vendor/ScrollTrigger.min.js"));
for (const f of ["inter-latin-opsz-normal.woff2", "inter-latin-ext-opsz-normal.woff2"]) cp(path.join(NM, "@fontsource-variable/inter/files", f), path.join(DIST, "assets/fonts", f));
for (const w of ["300", "400", "500"]) for (const s of ["normal", "italic"]) {
  const f = `cormorant-garamond-latin-${w}-${s}.woff2`;
  cp(path.join(NM, "@fontsource/cormorant-garamond/files", f), path.join(DIST, "assets/fonts", f));
}
let php = fs.readFileSync(path.join(SRC, "api/contact.php"), "utf8").replace("{{email}}", config.email).replace("{{host}}", new URL(config.siteUrl).hostname.replace(/^www\./, ""));
fs.mkdirSync(path.join(DIST, "api"), { recursive: true });
fs.writeFileSync(path.join(DIST, "api/contact.php"), php);

let htaccess = fs.readFileSync(path.join(SRC, "htaccess.txt"), "utf8");
if (STAGING) {
  htaccess = htaccess.replace(/  # HTTPS \+ www[\s\S]*?\[L,R=301\]\n/, "  RewriteCond %{HTTPS} off\n  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n");
  htaccess += '\n<IfModule mod_headers.c>\n  Header set X-Robots-Tag "noindex, nofollow"\n</IfModule>\n';
}
fs.writeFileSync(path.join(DIST, ".htaccess"), htaccess);

// Printable review QR
fs.writeFileSync(path.join(DIST, "assets/qr-google-review.svg"), qrSvg);
await QRCode.toFile(path.join(DIST, "assets/qr-google-review.png"), config.googleReviewWriteUrl, { width: 1200, margin: 2, color: { dark: "#1c1917", light: "#ffffff" } });

fs.writeFileSync(path.join(DIST, "robots.txt"), STAGING ? "User-agent: *\nDisallow: /\n" : `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  sitemap.map(({ id, lang }) => `  <url><loc>${config.siteUrl}${ROUTES[id][lang]}</loc><lastmod>${today}</lastmod><priority>${id === "home" ? "1.0" : ["privacy", "cookies"].includes(id) ? "0.3" : "0.8"}</priority>` +
    ["en", "it"].map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${config.siteUrl}${ROUTES[id][l]}"/>`).join("") + `</url>`).join("\n") + `\n</urlset>\n`);

// ---------- Zip for manual upload ----------
const zip = path.join(ROOT, "liliumhouse-hostinger.zip");
fs.rmSync(zip, { force: true });
try {
  execSync(`cd "${DIST}" && zip -qr -X "${zip}" . -x "*.DS_Store"`);
  console.log("✓ zip:", path.relative(ROOT, zip));
} catch {
  console.warn("! zip not available: upload the contents of dist/ manually");
}
console.log(`Build done → dist/ ${STAGING ? "(STAGING, noindex)" : "(production)"}`);
