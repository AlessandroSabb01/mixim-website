// =========================================================
// Build statico per Hostinger — nessuna dipendenza a runtime.
// node build.mjs  →  dist/ (da caricare in public_html) + giancaspro-hostinger.zip
// =========================================================
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");
const config = JSON.parse(fs.readFileSync(path.join(SRC, "config.json"), "utf8"));
const manifestPath = path.join(SRC, "assets/img/manifest.json");
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};

// ---------- Icone (stroke 1.6, stile lineare) ----------
const I = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const icons = {
  arrow: I('<path d="M5 12h14M13 6l6 6-6 6"/>', 'class="arrow"'),
  "arrow-up-right": I('<path d="M7 17L17 7M8 7h9v9"/>'),
  "chev-left": I('<path d="M15 18l-6-6 6-6"/>'),
  "chev-right": I('<path d="M9 18l6-6-6-6"/>'),
  calendar: I('<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/><path d="M8.5 14.5l2 2 4-4"/>'),
  tooth: I('<path d="M12 5.2c-1.7-1.3-4.6-1.9-6.2-.2-1.6 1.7-1.2 4.6-.2 6.6.8 1.5 1 3.2 1.2 5 .2 1.9.6 4.4 2 4.4 1.3 0 1.4-2.3 1.7-3.9.2-1.1.6-2 1.5-2s1.3.9 1.5 2c.3 1.6.4 3.9 1.7 3.9 1.4 0 1.8-2.5 2-4.4.2-1.8.4-3.5 1.2-5 1-2 1.4-4.9-.2-6.6-1.6-1.7-4.5-1.1-6.2.2z"/>'),
  pin: I('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  phone: I('<path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 6.9 6.9l1.3-2 4 1.6V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm0-21.6A11.8 11.8 0 0 0 1.9 18l-1.7 6 6.2-1.6A11.8 11.8 0 1 0 12 .2z"/></svg>`,
  mail: I('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 7l8.5 6 8.5-6"/>'),
  clock: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  instagram: I('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none"/>'),
  star: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.4L12 17.4l-5.7 3 1.1-6.4-4.6-4.5 6.4-.9z"/></svg>`,
  sparkle: I('<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z"/><path d="M19 15.5c.2 1.4 1 2.2 2.5 2.5-1.4.3-2.3 1.1-2.5 2.5-.3-1.4-1.1-2.2-2.5-2.5 1.4-.3 2.2-1.1 2.5-2.5z"/>'),
  close: I('<path d="M6 6l12 12M18 6L6 18"/>'),
  diamond: I('<path d="M6.5 4h11L21 9l-9 11L3 9z"/><path d="M3 9h18M9.5 4L8 9l4 11 4-11-1.5-5"/>'),
  aligner: I('<path d="M4 9c0-2.5 3.6-4 8-4s8 1.5 8 4v2.5c0 4-3.6 7.5-8 7.5s-8-3.5-8-7.5z"/><path d="M8 9.5v2M12 9v2.5M16 9.5v2"/>'),
  implant: I('<path d="M8 3h8l-1 4H9z"/><path d="M9.5 7h5M9 10h6M9.5 13h5M10 16h4M10.5 19h3"/><path d="M12 7v15"/>'),
  face: I('<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14.5c1 1.2 2.1 1.8 3.5 1.8s2.5-.6 3.5-1.8"/><path d="M9 9.5h.01M15 9.5h.01"/>'),
  kid: I('<circle cx="12" cy="7" r="3.5"/><path d="M5.5 21c.6-4 3.3-6.5 6.5-6.5s5.9 2.5 6.5 6.5"/>'),
  leaf: I('<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19l7-7"/>'),
  microscope: I('<path d="M6 21h12M9 17h6M12 17v4"/><path d="M14 4l3 3-5 5-3-3z"/><path d="M15.5 13A5 5 0 0 1 7 16.5"/>'),
  scan: I('<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M4 12h16"/>'),
  cube: I('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>'),
  waves: I('<path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>'),
  car: I('<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3z"/><circle cx="7.5" cy="13" r=".8" fill="currentColor"/><circle cx="16.5" cy="13" r=".8" fill="currentColor"/>'),
  users: I('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.4-3.5 2.8-5.5 6-5.5s5.6 2 6 5.5"/><path d="M15.5 4.8a3.2 3.2 0 0 1 0 6.4M17.5 14.7c2 .6 3.2 2.4 3.5 5.3"/>'),
  globe: I('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>'),
  shield: I('<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z"/><path d="M9 12l2 2 4-4"/>'),
  cookie: I('<path d="M20.5 12.5A8.5 8.5 0 1 1 11.5 3.5a3 3 0 0 0 4 4 3 3 0 0 0 5 5z"/><path d="M8.5 9.5h.01M15 15.5h.01M9 15h.01M12 12.5h.01"/>'),
  download: I('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
  google: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z"/></svg>`,
};
const stars5 = Array(5).fill(icons.star).join("");

// ---------- Immagini responsive ----------
function img(name, alt = "", sizes = "100vw", cls = "", eager = "", extra = "") {
  const m = manifest[name];
  if (!m) throw new Error(`Immagine mancante nel manifest: ${name}`);
  const srcset = m.widths.map((w) => `/assets/img/${name}-${w}.webp ${w}w`).join(", ");
  const def = m.widths.includes(1280) ? 1280 : m.widths[m.widths.length - 1];
  const loading = eager === "eager" ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  return `<img src="/assets/img/${name}-${def}.webp" srcset="${srcset}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${alt}" ${loading} decoding="async"${cls ? ` class="${cls}"` : ""}${extra ? " " + extra : ""}>`;
}

// ---------- Template engine minimale ----------
const partial = (n) => fs.readFileSync(path.join(SRC, "partials", n + ".html"), "utf8");
function render(tpl, ctx, depth = 0) {
  if (depth > 10) throw new Error("Include troppo annidati");
  // {{> nome}} oppure {{> nome:prefisso}} (il prefisso sostituisce __P__ per avere id univoci)
  tpl = tpl.replace(/\{\{>\s*([\w-]+)(?::([\w-]+))?\s*\}\}/g, (_, n, p) => render(partial(n).replace(/__P__/g, p || "f"), ctx, depth + 1));
  tpl = tpl.replace(/\{\{img\s+([^}]+)\}\}/g, (_, args) => img(...args.split("|").map((s) => s.trim())));
  tpl = tpl.replace(/\{\{icon\s+([\w-]+)\}\}/g, (_, n) => {
    if (!icons[n]) throw new Error("Icona mancante: " + n);
    return icons[n];
  });
  tpl = tpl.replace(/\{\{stars\}\}/g, stars5);
  tpl = tpl.replace(/\{\{([\w.]+)\}\}/g, (m, k) => (k in ctx ? ctx[k] : m));
  return tpl;
}

// ---------- Pagine ----------
const pages = [
  { file: "index", path: "/" },
  { file: "trattamenti", path: "/trattamenti/" },
  { file: "team", path: "/team/" },
  { file: "studio", path: "/studio/" },
  { file: "contatti", path: "/contatti/" },
  { file: "privacy-policy", path: "/privacy-policy/" },
  { file: "cookie-policy", path: "/cookie-policy/" },
  { file: "404", path: "/404.html", noindex: true },
];

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// QR code recensioni Google (SVG inline + file da stampare)
const qrSvg = await QRCode.toString(config.googleReviewWriteUrl, { type: "svg", margin: 0, color: { dark: "#04121f", light: "#ffffff" }, errorCorrectionLevel: "M" });
const qrInline = qrSvg.replace("<svg ", '<svg role="img" aria-label="QR code per lasciare una recensione su Google" ');

const nav = [
  ["/", "Home"], ["/trattamenti/", "Trattamenti"], ["/team/", "Team"], ["/studio/", "Studio"], ["/contatti/", "Contatti"],
];

for (const p of pages) {
  const raw = fs.readFileSync(path.join(SRC, "pages", p.file + ".html"), "utf8");
  const metaMatch = raw.match(/^<!--meta\s+([\s\S]*?)-->/);
  const meta = metaMatch ? JSON.parse(metaMatch[1]) : {};
  const body = raw.replace(/^<!--meta[\s\S]*?-->\s*/, "");
  const ctx = {
    ...config,
    ...meta,
    canonical: config.siteUrl + (p.path === "/404.html" ? "/" : p.path),
    robots: p.noindex ? "noindex, follow" : "index, follow",
    qr: qrInline,
    headerTheme: meta.headerTheme || "dark",
  };
  ctx.navLinks = nav.map(([href, label]) => `<li><a href="${href}"${href === p.path ? ' aria-current="page"' : ""}>${label}</a></li>`).join("");
  ctx.menuLinks = nav.map(([href, label], i) => `<li><a href="${href}"${href === p.path ? ' aria-current="page"' : ""}><small>0${i + 1}</small>${label}</a></li>`).join("");
  ctx.content = render(body, ctx);
  const html = render(partial("layout"), ctx);
  const out = p.path.endsWith(".html") ? path.join(DIST, p.path) : path.join(DIST, p.path, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const leftover = html.match(/\{\{[^}]+\}\}/g);
  if (leftover) throw new Error(`Segnaposto non risolti in ${p.file}: ${leftover.join(", ")}`);
  fs.writeFileSync(out, html);
  console.log("✓", p.path);
}

// ---------- Asset ----------
const cp = (a, b) => { fs.mkdirSync(path.dirname(b), { recursive: true }); fs.cpSync(a, b, { recursive: true }); };
cp(path.join(SRC, "assets/css"), path.join(DIST, "assets/css"));
cp(path.join(SRC, "assets/js"), path.join(DIST, "assets/js"));
for (const f of fs.readdirSync(path.join(SRC, "assets/img"))) {
  if (f.endsWith(".webp") || f.endsWith(".png") || f.endsWith(".svg") || f.endsWith(".ico")) cp(path.join(SRC, "assets/img", f), path.join(DIST, "assets/img", f));
}
const NM = path.join(ROOT, "node_modules");
cp(path.join(NM, "lenis/dist/lenis.min.js"), path.join(DIST, "assets/vendor/lenis.min.js"));
cp(path.join(NM, "gsap/dist/gsap.min.js"), path.join(DIST, "assets/vendor/gsap.min.js"));
cp(path.join(NM, "gsap/dist/ScrollTrigger.min.js"), path.join(DIST, "assets/vendor/ScrollTrigger.min.js"));
for (const f of ["inter-latin-opsz-normal.woff2", "inter-latin-ext-opsz-normal.woff2", "inter-latin-opsz-italic.woff2"]) {
  cp(path.join(NM, "@fontsource-variable/inter/files", f), path.join(DIST, "assets/fonts", f));
}
cp(path.join(SRC, "api"), path.join(DIST, "api"));
fs.copyFileSync(path.join(SRC, "htaccess.txt"), path.join(DIST, ".htaccess"));
fs.writeFileSync(path.join(DIST, "assets/qr-recensioni-google.svg"), qrSvg);
await QRCode.toFile(path.join(DIST, "assets/qr-recensioni-google.png"), config.googleReviewWriteUrl, { width: 1200, margin: 2, color: { dark: "#04121f", light: "#ffffff" } });

fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${config.siteUrl}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.path === "/" ? "1.0" : p.path.includes("policy") ? "0.3" : "0.8"}</priority></url>`).join("\n") +
  `\n</urlset>\n`);

// ---------- Zip per upload manuale su Hostinger ----------
const zip = path.join(ROOT, "giancaspro-hostinger.zip");
fs.rmSync(zip, { force: true });
try {
  execSync(`cd "${DIST}" && zip -qr -X "${zip}" . -x "*.DS_Store"`);
  console.log("✓ zip:", path.relative(ROOT, zip));
} catch {
  console.warn("! comando zip non disponibile: carica manualmente il contenuto di dist/");
}
console.log("Build completata →", path.relative(process.cwd(), DIST));
