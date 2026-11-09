import fs from "node:fs";
import path from "node:path";
import QRCode from "qrcode";
import { layout } from "./src/partials/layout.js";
import { homePage } from "./src/pages/home.js";
import { locationPage } from "./src/pages/location.js";
import { aboutPage } from "./src/pages/about.js";
import { contactPage } from "./src/pages/contact.js";
import { privacyPolicyPage, cookiePolicyPage } from "./src/pages/legal.js";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DIST = path.join(ROOT, "dist");
const STAGING = process.env.STAGING === "1";
const SITE_URL = process.env.SITE_URL || "https://liliumhouse.miximcreativestudio.com";

const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "src/config.json"), "utf8"));
cfg.seo.siteUrl = SITE_URL;

function write(relPath, content){
  const full = path.join(DIST, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function copyDir(src, dest){
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })){
    const s = path.join(src, entry.name), d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// clean dist
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const pages = [
  { path:"/", title:"Home", description: cfg.seo.description, body: homePage(cfg), out:"index.html" },
  { path:"/rome/", title:"Rome · Aventino", body: locationPage(cfg,"rome"), out:"rome/index.html" },
  { path:"/crete/", title:"Crete · Palekastro", body: locationPage(cfg,"crete"), out:"crete/index.html" },
  { path:"/about/", title:"About", body: aboutPage(cfg), out:"about/index.html" },
  { path:"/contact/", title:"Contact", body: contactPage(cfg), out:"contact/index.html" },
  { path:"/privacy-policy/", title:"Privacy Policy", body: privacyPolicyPage(cfg), out:"privacy-policy/index.html" },
  { path:"/cookie-policy/", title:"Cookie Policy", body: cookiePolicyPage(cfg), out:"cookie-policy/index.html" },
];

for (const page of pages){
  write(page.out, layout(cfg, page, page.body));
}

// assets
copyDir(path.join(ROOT, "src/assets"), path.join(DIST, "assets"));

// api
copyDir(path.join(ROOT, "src/api"), path.join(DIST, "api"));

// review QR (inline SVG + printable files)
const qrSvg = await QRCode.toString(cfg.reviews.googleReviewLink, { type: "svg", margin: 1, color: { dark: "#1c1b19", light: "#ffffff" } });
write("assets/img/review-qr.svg", qrSvg);
await QRCode.toFile(path.join(DIST, "assets/review-qr-print.png"), cfg.reviews.googleReviewLink, { width: 1000, margin: 2 });
await QRCode.toFile(path.join(DIST, "assets/review-qr-print.svg"), cfg.reviews.googleReviewLink, { width: 1000, margin: 2, type: "svg" });

// sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p=>`  <url><loc>${SITE_URL}${p.path}</loc></url>`).join("\n")}
</urlset>`;
write("sitemap.xml", sitemap);

// robots
write("robots.txt", STAGING
  ? "User-agent: *\nDisallow: /\n"
  : `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);

// 404
write("404.html", layout(cfg, { path:"/404/", title:"Not Found" }, `
  <section class="page-hero" style="text-align:center">
    <div class="wrap"><h1 class="display">Page Not Found</h1><p class="lead" style="margin:0 auto 20px">The page you're looking for doesn't exist.</p><a href="/" class="btn solid">Back Home</a></div>
  </section>`));

// .htaccess
const htaccess = `
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
${STAGING ? "" : `RewriteCond %{HTTP_HOST} ^liliumhouse\\.com$ [NC]
RewriteRule ^(.*)$ https://www.liliumhouse.com/$1 [R=301,L]
`}
ErrorDocument 404 /404.html
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
`;
write(".htaccess", htaccess);

if (!STAGING){
  // build the zip for Hostinger upload (skip during staging deploy prep)
  const { execSync } = await import("node:child_process");
  try {
    execSync(`cd ${DIST} && zip -qr ../liliumhouse-dist.zip .`, { stdio: "inherit" });
  } catch(e){
    console.warn("zip step skipped:", e.message);
  }
}

console.log(`Built ${pages.length} pages -> dist/ ${STAGING ? "(STAGING, noindex)" : "(production)"}`);
