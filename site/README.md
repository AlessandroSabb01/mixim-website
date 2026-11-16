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
4. `cal_link`: your Cal.com event, e.g. `mixim/consultation` (see "Cal.com + Stripe" below).
5. Optional: `instagram`, `linkedin`, `team_links` (CV and portfolio URLs), `testimonials`.
6. Optional analytics: set `ga4_id`. The consent banner appears automatically and nothing loads before "Accept".

Testimonials format:

```json
"testimonials": [
  {"quote": {"en": "…", "it": "…"}, "name": "Name Surname", "role": {"en": "Founder, Brand", "it": "Fondatrice, Brand"}}
]
```

Preview the testimonials layout with placeholders: open `index.html?preview=1`.

## Cal.com + Stripe (paid €50 consultation)

When `cal_link` is set, the site shows a "Choose a date and time" card in the booking section and the
consultation card's button opens the Cal.com calendar in a popup (dark theme, ochre accent).
Nothing loads from Cal.com until the visitor clicks. Items picked from the à la carte menu are passed
into the booking notes. If the popup can't load, the link opens the Cal.com page in a new tab.
The privacy policy automatically adds the Cal.com and Stripe sections.

Setup (only you can do this, it needs your own accounts):

1. **Stripe**: create an account at stripe.com and activate payments (business details + bank account for payouts).
2. **Cal.com**: sign up and choose your username (e.g. `mixim`). In *Settings > Calendars* connect the Google
   Calendar you use, so busy times are blocked. In *Availability* set your working hours and time zone.
3. **Apps > Stripe > Install**, then connect the Stripe account from step 1.
4. **Event Types > New**: title "Consultation", URL slug `consultation`, duration 60 minutes.
   Locations: add "In person (organizer address)" and a video option (Cal Video or Google Meet) so the client chooses.
5. In the event's **Apps** tab, enable Stripe: price `50`, currency `EUR`.
6. **Advanced > Booking questions**: add "Company or brand" (required) and "Website or Instagram" (optional).
   Keep "Additional notes": it receives the services picked on the website.
7. Recommended: minimum notice 24 h, 15 min buffer after each meeting, and write your cancellation/refund rule
   in the event description.
8. Put `username/consultation` into `build/config.json > cal_link`, then run `bash build/hostinger/pack.sh` and upload the zip.

Event description you can paste (EN / IT):

> One focused hour about your brand, your goals and what is holding you back. In person or by video.
> The €50 fee is credited in full to your project if you choose to work with us.

> Un'ora dedicata al vostro brand, ai vostri obiettivi e a ciò che vi frena. Di persona o in videochiamata.
> I 50 € vengono interamente scalati dal progetto se scegliete di lavorare con noi.

If you use Cal.com's EU data region instead of cal.com, also change `cal_origin` and `cal_embed_js` in config.json.

## Hero frames

`media/hero/` (desktop, 1440 px) and `media/hero-m/` (mobile portrait crop) hold 121 webp frames extracted
from the hero video. Frames load only after the first interaction; the first frame is the LCP image.
