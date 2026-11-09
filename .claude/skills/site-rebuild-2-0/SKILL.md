---
name: site-rebuild-2-0
description: Rebuild an existing client website as a "2.0" — same pages, structure, copy and photos, but a brand-new, fresh, premium look with fluid animations, GDPR compliance, Google reviews + QR, Instagram feed, booking UI, and a Hostinger subdomain preview deploy. Use when the user says "rebuild 2.0", "redo the site for <client>", "same as Giancaspro", or gives an old site URL to modernise.
---

# Site Rebuild 2.0

Goal: the client recognises **their** site (same pages, same copy, same photos, same brand colours/logo), but it feels brand new, modern and "wow". We do NOT redesign the information architecture; we re-skin, polish and add conversion + compliance features.

Reference implementation: `giancaspro/` in this repo (static generator `build.mjs`, `src/partials`, `src/pages`, `src/assets`). **Copy it as the starting template** into `<client-slug>/` and adapt — don't start from zero.

---

## 0. Kick-off — ask first (multiple choice, A/B/C)

Ask in one message, only what you can't infer:
1. Old site URL + new folder name (`<client-slug>/`).
2. Brand palette: keep logo colours only (recommended) / add one accent / client provides.
3. Intro loader: brand-shape fill 0→100 (A) / logo reveal (B) / none (C). No sound.
4. Booking: modal form + WhatsApp + Call (A, recommended) / external booking link (B) / form only (C).
5. Reviews: Google reviews section + "Leave a review" button + printable QR (need the review link the client gets from Google Business → "Ask for reviews").
6. Instagram feed: Behold.so (need feed ID) / none.
7. Legal data available? (VAT, registered office, medical director/registration if healthcare, DPO). If not → template placeholders.
8. Deploy target: Hostinger subdomain preview `https://<client>.miximcreativestudio.com/` (default) and later the client's real domain.

## 1. Inventory the old site (do not lose anything)

- Crawl every page in the sitemap/nav: copy **all text verbatim** into the new pages. Only fix real inconsistencies (typos, conflicting phone/hours) and list each fix for the user.
- Download **all original images** into the scratchpad `raw/`. Keep originals.
- Collect: phone, WhatsApp, email, address, hours, maps link/embed, socials, old URLs (for 301 redirects).
- Put all business data in `src/config.json` — never hardcode it in pages.

## 2. Images — HARD RULES (learned the hard way)

- **Use the client's original photos only.** No AI upscale, no AI edits, no generated images unless the user explicitly asks. Only convert to responsive WebP (`scripts/images.py`, widths 480/960/1280/1920 + native width, quality 80, no sharpening).
- **Faces must never be cut** on mobile (390), tablet (820), desktop (1440) and wide (2000):
  - Default `main img { object-position: 50% 20%; }`; portrait cards `object-position: 50% 0`.
  - Overlay labels/tags on photos go at the **bottom**, never over heads.
  - No parallax on photos of people if it pushes heads out of frame.
  - Don't relayout the hero to "save" faces unless asked — fix with object-position first.
- Verify with an automated crop check (Playwright: for each `main img` with `object-fit: cover`, compute the visible fraction and the top cut) **plus** element screenshots of every photo at 4 widths, reviewed visually as a contact sheet.

## 3. Design system ("2.0 vibe")

Keep the brand; upgrade the execution:
- Palette from the logo (e.g. white / brand blue / greys). No extra accent unless the client wants it.
- Self-hosted modern sans (e.g. Inter variable via fontsource), big display headings with light/bold contrast (`Studio **Name**`).
- Square or consistent radius (ask the client's taste; Giancaspro = square, minimal, elegant).
- Header: full-width, fixed, white, subtle shadow, active-link underline. Mobile: 3-bar burger → X; menu with quick buttons (WhatsApp / Instagram / Maps) + one big "Call" button.
- Hero: full-bleed original photo with gradient overlay, display title, sub, and a UI "dock" of tiles: Book (modal), Treatments/Services, Where we are, Contacts.
- Sections: alternate white / soft gradient backgrounds for depth; dark brand sections with radial glows.
- Motion (GSAP + ScrollTrigger + Lenis, vendored locally): word-split title reveals, clip-path image reveals, sections that "open" (`clip-path inset → 0`) on scroll, staggered cards, auto-advancing galleries (pause on hover), page-transition curtain. Respect `prefers-reduced-motion`.
- **Display-title clipping:** split-word spans need right/bottom padding (`padding: 0 .14em .08em 0; margin: 0 -.14em -.08em 0`) or the last letter (e.g. "o") gets cut with negative letter-spacing.
- Footer credit (always): "Sito progettato e sviluppato da **Alessandro Sabbadini** — Ti piace questo sito? Scopri come posso creare il tuo →" linking to https://alessandrosabbadini.com/.

## 4. Conversion features

- Booking modal (name, phone, email, reason, preferred time, privacy checkbox) → `api/contact.php` (PHP `mail()`, honeypot, rate limit) with WhatsApp prefilled fallback.
- Mobile sticky action bar: Call / WhatsApp / Book.
- Google reviews: rating, review cards carousel, "Leave a review" button using the client's exact review link, QR generated at build (`qrcode` npm) as inline SVG + printable PNG/SVG in `/assets/`.
- Instagram via Behold.so (blocked until consent).
- JSON-LD `LocalBusiness` subtype (Dentist, Restaurant…), OG tags, canonical, sitemap.xml, robots.txt.

## 5. GDPR (EU / Italy)

- Cookie banner: Reject / Accept all / Customize, equal prominence; consent stored 6 months (`localStorage`), re-openable from "Cookie preferences" in the footer.
- Third parties (Google Maps iframe, Behold, any embed) **blocked until consent**, with a click-to-load placeholder.
- No analytics unless consented (or use cookieless).
- `privacy-policy` and `cookie-policy` pages as complete templates with `[[PLACEHOLDERS]]` for data the client must fill in; footer legal line (VAT, director/registration where required).
- Forms: explicit privacy checkbox + link; no data stored beyond email delivery.
- List all placeholders for the user at the end as a client checklist.

## 6. Build & quality pass

- `node build.mjs` → `dist/` (clean URLs, 404, sitemap, robots, QR, zip for Hostinger).
- `.htaccess`: HTTPS (+ www on production), caching, 301s from old URLs.
- Run the `web-design-reviewer` skill (and `site-structure-optimizer` for links/orphans).
- Playwright checks at 390 / 820 / 1440 / 2000: no JS errors, no horizontal overflow, menus/modals/consent work, faces OK (section 2), titles not clipped.
- Send the user a few screenshots (hero desktop + mobile, a key section, mobile menu).

## 7. Deploy to Hostinger (preview subdomain)

Use the Hostinger connector:
1. `hosting_websites_list` → find `miximcreativestudio.com` (username, e.g. `u837137884`).
2. `hosting_websites_add-domain` `{domain: "miximcreativestudio.com", type: "subdomain", name: "<client>"}`.
3. Staging build: `SITE_URL=https://<client>.miximcreativestudio.com STAGING=1 node build.mjs` (noindex everywhere, `robots.txt` Disallow, `X-Robots-Tag`, no www redirect).
4. Push `dist/` contents (without the zip) to branch `hostinger-<client>-preview` of the repo.
5. `hosting_git_deploy-website-repository` with domain `<client>.miximcreativestudio.com`, repo HTTPS URL, that branch. Re-run it after each new push to update.
6. Verify with curl (200s, HTTP→HTTPS) and a live Playwright screenshot.
7. Rebuild the **production** zip afterwards (`node build.mjs`) so the committed zip is for the real domain.

## 8. Workflow etiquette

- Commit + push to the working branch after each milestone; never open a PR unless asked.
- When the client approves a look ("the rest is perfect"), change **only** what is asked next.
- Final message: short list of what changed, live link, open client checklist (placeholders, review link, Behold ID, hours).
