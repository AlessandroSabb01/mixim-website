# Mixim website

Static, bilingual (EN/IT) single-page site with a scroll-driven hero, à la carte service menu,
consultation booking and GDPR-compliant privacy setup. No framework, no third-party requests.

## Edit and build

| What | Where |
|---|---|
| All texts (EN + IT) | `build/copy.json` |
| Brand, email, phone, socials, CV/portfolio links, testimonials, form endpoint, analytics | `build/config.json` |
| Layout, styles, scripts | `build/src.html` |
| Privacy policy | `build/privacy_en.html`, `build/privacy_it.html` |

```bash
python3 build/build.py          # writes index.html, it.html, privacy.html, privacy-it.html
bash build/hostinger/pack.sh    # builds + creates mixim-hostinger.zip for Hostinger
```

Never edit the generated `*.html` files at the root by hand.

## Before going live

1. `config.json > legal`: company name, registered address, VAT number (shown in the privacy policy).
2. `config.json > site_url`: the final domain, e.g. `https://mixim.studio` (enables canonical, hreflang, sitemap, absolute OG image).
3. `config.json > form_endpoint`: deploy `build/google-apps-script.gs` (instructions inside) and paste the Web app URL.
   Without it, the form opens the visitor's email app with the request pre-filled.
4. Optional: `booking_url` (e.g. a Cal.com page with Stripe for the €50), `instagram`, `linkedin`,
   `team_links` (CV and portfolio URLs), `testimonials`.
5. Optional analytics: set `ga4_id`. The consent banner appears automatically and nothing loads before "Accept".

Testimonials format:

```json
"testimonials": [
  {"quote": {"en": "…", "it": "…"}, "name": "Name Surname", "role": {"en": "Founder, Brand", "it": "Fondatrice, Brand"}}
]
```

Preview the testimonials layout with placeholders: open `index.html?preview=1`.

## Hero frames

`media/hero/` (desktop, 1440 px) and `media/hero-m/` (mobile portrait crop) hold 121 webp frames extracted
from the hero video. Frames load only after the first interaction; the first frame is the LCP image.
