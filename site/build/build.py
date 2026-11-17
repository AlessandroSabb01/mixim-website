#!/usr/bin/env python3
"""Build the static site.

  python3 build/build.py

Reads build/src.html, build/copy.json (all texts, EN + IT) and build/config.json
(brand, contacts, endpoints, testimonials) and writes:
  index.html (EN), it.html (IT), privacy.html, privacy-it.html, sitemap.xml, robots.txt
Never edit the generated HTML by hand.
"""
import datetime, html, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def load(name):
    with open(os.path.join(HERE, name), encoding="utf-8") as f:
        return json.load(f)


COPY = load("copy.json")
CFG = load("config.json")
SRC = open(os.path.join(HERE, "src.html"), encoding="utf-8").read()
UPDATED = datetime.date.today()

ARROW = ('<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12L12 4M12 4H5.5M12 4V10.5" '
         'stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>')
PLUS = ('<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 1v10M1 6h10" stroke="currentColor" '
        'stroke-width="1.3" stroke-linecap="round"/></svg>')

HERO = {
    "d": {"path": "media/hero/f", "n": len([f for f in os.listdir(os.path.join(ROOT, "media/hero")) if f.endswith(".webp")])},
    "m": {"path": "media/hero-m/f", "n": len([f for f in os.listdir(os.path.join(ROOT, "media/hero-m")) if f.endswith(".webp")])},
}

e = html.escape
strip = lambda s: re.sub(r"<[^>]+>", "", s)


def url(path):
    base = CFG.get("site_url", "").rstrip("/")
    return f"{base}/{path}" if base else path


def conditionals(s):
    """<!--if:key-->...<!--/if:key--> kept only when the config value is truthy,
    <!--ifnot:key-->...<!--/ifnot:key--> only when it is empty."""
    s = re.sub(r"<!--if:(\w+)-->(.*?)<!--/if:\1-->", lambda m: m.group(2) if CFG.get(m.group(1)) else "", s, flags=re.S)
    return re.sub(r"<!--ifnot:(\w+)-->(.*?)<!--/ifnot:\1-->", lambda m: "" if CFG.get(m.group(1)) else m.group(2), s, flags=re.S)


def phone_tel(p):
    return re.sub(r"[^\d+]", "", p)


def gen(lang):
    t = COPY[lang]
    brand = CFG["brand"]
    g = {}
    g["brand"] = e(brand)
    g["arrow"] = ARROW
    g["email"] = e(CFG["email"])
    g["phone"] = e(CFG.get("phone", ""))
    g["phone_tel"] = phone_tel(CFG.get("phone", ""))
    g["whatsapp"] = e(CFG.get("whatsapp", ""))
    cal_link = CFG.get("cal_link", "").strip("/")
    g["cal_url"] = e(f'{CFG.get("cal_origin", "https://cal.com").rstrip("/")}/{cal_link}')
    g["mail_subject"] = e(t["subject"]).replace(" ", "%20")
    g["legal_line"] = e(brand) if CFG["legal"]["company"].startswith("[") else e(CFG["legal"]["company"])
    g["hero_first"] = HERO["d"]["path"] + "001.webp"
    g["hero_first_m"] = HERO["m"]["path"] + "001.webp"
    g["og_image"] = url("og-image.jpg")

    other = COPY[t["other_lang"]]
    # canonical + hreflang must be absolute URLs, so they are only emitted once site_url is known
    g["head_links"] = "\n".join([
        f'<link rel="canonical" href="{url(t["page"] if t["page"] != "index.html" else "")}">',
        f'<link rel="alternate" hreflang="en" href="{url("")}">',
        f'<link rel="alternate" hreflang="it" href="{url("it.html")}">',
        f'<link rel="alternate" hreflang="x-default" href="{url("")}">',
    ]) if CFG.get("site_url") else ""

    ld = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": brand,
        "description": t["meta_desc"],
        "email": CFG["email"],
        "image": url("og-image.jpg"),
        "areaServed": "Europe",
        "knowsLanguage": ["en", "it"],
        "makesOffer": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": c["title"]}} for c in t["menu_courses"]],
    }
    if CFG.get("site_url"):
        ld["url"] = CFG["site_url"]
    if CFG.get("phone"):
        ld["telephone"] = phone_tel(CFG["phone"])
    same = [CFG[k] for k in ("instagram", "linkedin") if CFG.get(k)]
    if same:
        ld["sameAs"] = same
    g["ld_json"] = json.dumps(ld, ensure_ascii=False).replace("</", "<\\/")

    # menu
    vis, courses = [], []
    for i, c in enumerate(t["menu_courses"]):
        vis.append(f'<img data-course="{c["id"]}" src="img/{c["img"]}.webp" width="896" height="1120" alt="" loading="lazy" decoding="async">')
        dishes = "".join(
            f'<li><button type="button" class="dish" aria-pressed="false" data-pick="{e(c["title"])} · {e(it)}">'
            f'<span>{e(it)}</span><span class="add" aria-hidden="true">{PLUS}</span>'
            f'<span class="sr">{e(t["dish_add"])}</span></button></li>'
            for it in c["items"])
        courses.append(
            f'<article class="course rv" data-course="{c["id"]}">'
            f'<div class="course-top"><span class="course-num">{c["num"]}.</span><h3>{e(c["title"])}</h3></div>'
            f'<p class="course-desc">{e(c["desc"])}</p>'
            f'<div class="course-img"><img src="img/{c["img"]}-sm.webp" width="560" height="700" alt="{e(c["alt"])}" loading="lazy" decoding="async"></div>'
            f'<ul class="dishes">{dishes}</ul></article>')
    g["menu_visual"] = "".join(vis)
    g["menu"] = "".join(courses)

    g["steps"] = "".join(
        f'<div class="step rv rv-d{i % 4}"><span class="n">{s["n"]}</span><h3>{e(s["t"])}</h3><p>{e(s["d"])}</p></div>'
        for i, s in enumerate(t["steps"]))

    people = []
    for p in t["team"]:
        links = CFG["team_links"].get(p["key"], {})
        acts = []
        if links.get("cv"):
            acts.append(f'<a class="btn btn-ghost btn-sm" href="{e(links["cv"])}" target="_blank" rel="noopener">{e(t["team_cv"])} {ARROW}</a>')
        else:
            subj = e(f'{t["team_cv_request"]} · {p["name"]}').replace(" ", "%20")
            acts.append(f'<a class="btn btn-ghost btn-sm" href="mailto:{e(CFG["email"])}?subject={subj}">{e(t["team_cv_request"])} {ARROW}</a>')
        if links.get("portfolio"):
            acts.append(f'<a class="btn btn-solid btn-sm" href="{e(links["portfolio"])}" target="_blank" rel="noopener">{e(t["team_portfolio"])} {ARROW}</a>')
        if links.get("linkedin"):
            acts.append(f'<a class="btn btn-ghost btn-sm" href="{e(links["linkedin"])}" target="_blank" rel="noopener">{e(t["team_linkedin"])} {ARROW}</a>')
        bio = f'<p class="bio">{e(p["bio"])}</p>' if p.get("bio") else ""
        people.append(
            f'<article class="person rv"><div class="mono" aria-hidden="true">{p["initial"]}</div>'
            f'<div><h3>{e(p["name"])}</h3><p class="role">{e(p["role"])}</p>{bio}</div>'
            f'<div class="acts">{"".join(acts)}</div></article>')
    g["team"] = "".join(people)

    g["portfolio_url"] = e(CFG.get("portfolio_url", ""))
    g["work_stats"] = "".join(f'<div class="stat"><b>{e(s["n"])}</b><span>{e(s["t"])}</span></div>' for s in t["work_stats"])
    g["work"] = "".join(
        f'<a class="wk rv" href="{e(w["url"])}" target="_blank" rel="noopener">'
        f'<div class="wk-img"><img src="img/work/{w["key"]}.webp" width="960" height="572" '
        f'alt="{e(w["name"])}, {e(t["work_visit"].lower())}" loading="lazy" decoding="async">'
        f'<span class="wk-go" aria-hidden="true">{e(t["work_visit"])} {ARROW}</span></div>'
        f'<div class="wk-meta"><h3>{e(w["name"])}</h3>'
        f'<p class="res"><b>{e(w["n"])}</b><span>{e(w["label"])}</span></p>'
        f'<p class="sector">{e(w["sector"])}</p><p class="svc">{e(w["services"])} · {e(w["year"])}</p></div></a>'
        for w in t["work"])

    g["faq"] = "".join(
        f'<details class="qa"><summary>{e(q["q"])}<i aria-hidden="true"></i></summary><p>{e(q["a"])}</p></details>'
        for q in t["faq"])

    g["interests"] = "".join(
        f'<label class="chip"><input type="checkbox" name="interest" value="{e(x)}"><span>{e(x)}</span></label>'
        for x in t["interests"])

    def voices_section(items, preview=False):
        quotes = "".join(
            f'<figure class="quote rv"><blockquote>{e(q["quote"])}</blockquote>'
            f'<figcaption>{e(q["name"])}<span>{e(q["role"])}</span></figcaption></figure>' for q in items)
        return (f'<section class="voices sec" id="voices"><div class="wrap">'
                f'<span class="label rv">{t["voices_label"]}</span><h2 class="h2 rv rv-d1">{t["voices_title"]}</h2>'
                f'<div class="quotes">{quotes}</div></div></section>')

    tests = [{"quote": q["quote"][lang], "name": q["name"], "role": q["role"][lang]} for q in CFG.get("testimonials", [])
             if q.get("quote", {}).get(lang)]
    if tests:
        g["voices"] = voices_section(tests)
    else:
        ph = [{"quote": t["voices_preview_quote"], "name": t["voices_preview_name"], "role": t["voices_preview_role"]}] * 3
        g["voices"] = f'<template id="voicesPreview">{voices_section(ph, True)}</template>'

    social = []
    for k, label in (("instagram", "Instagram"), ("linkedin", "LinkedIn")):
        if CFG.get(k):
            social.append(f'<li><a href="{e(CFG[k])}" target="_blank" rel="noopener">{label}</a></li>')
    if CFG.get("whatsapp"):
        social.append(f'<li><a href="https://wa.me/{e(CFG["whatsapp"])}" target="_blank" rel="noopener">WhatsApp</a></li>')
    g["social"] = "".join(social)

    g["cfg_json"] = json.dumps({
        "email": CFG["email"], "endpoint": CFG.get("form_endpoint", ""), "ga4": CFG.get("ga4_id", ""), "hero": HERO,
        "cal": {"link": cal_link, "origin": CFG.get("cal_origin", "https://cal.com"),
                "js": CFG.get("cal_embed_js", "https://app.cal.com/embed/embed.js")}})
    g["t_json"] = json.dumps({
        "lang": lang, "tray": t["tray"], "picked": t["picked"], "subject": t["subject"],
        "invalid": t["f_invalid"], "sending": t["f_sending"], "offline": t["f_offline"],
        "err": t["f_err"].replace("{email}", CFG["email"]), "mail_fallback": t["f_mail_fallback"],
        "f_name": t["f_name"], "f_company": t["f_company"], "f_website": t["f_website"],
        "f_interest": t["f_interest"], "f_format": t["f_format"]}, ensure_ascii=False).replace("</", "<\\/")
    return t, g


def render(tpl, t, g):
    tpl = conditionals(tpl)
    tpl = re.sub(r"\{\{@(\w+)\}\}", lambda m: g[m.group(1)], tpl)

    def tr(m):
        k = m.group(1)
        v = t[k]
        if not isinstance(v, str):
            raise KeyError(k)
        v = v.replace("{privacy}", t["privacy_page"]).replace("{email}", CFG["email"])
        return v
    out = re.sub(r"\{\{(\w+)\}\}", tr, tpl)
    left = re.findall(r"\{\{[^}]+\}\}", out)
    if left:
        raise SystemExit(f"Unresolved placeholders: {left[:5]}")
    return out


PRIVACY_SHELL = """<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} | {brand}</title>
<meta name="robots" content="noindex, follow">
<meta name="theme-color" content="#121212">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<style>
@font-face{{font-family:"Satoshi";src:url(fonts/Satoshi-Variable.woff2) format("woff2");font-weight:300 900;font-display:swap}}
@font-face{{font-family:"Instrument Serif";src:url(fonts/instrument-serif-latin-400-italic.woff2) format("woff2");font-style:italic;font-display:swap}}
body{{margin:0;background:#111;color:#ECE6DA;font-family:"Satoshi",system-ui,sans-serif;font-size:17px;line-height:1.7;-webkit-font-smoothing:antialiased}}
a{{color:#C29A5E}}
.top{{display:flex;justify-content:space-between;align-items:center;max-width:820px;margin:0 auto;padding:28px 16px}}
.top a{{color:#ECE6DA;text-decoration:none}}
.logo{{font-weight:600;letter-spacing:.22em;text-transform:uppercase;font-size:15px}}
.top nav a{{font-size:14px;margin-left:18px;color:#a59f94}}
main{{max-width:820px;margin:0 auto;padding:24px 16px 120px}}
h1{{font-size:clamp(40px,7vw,72px);line-height:1;letter-spacing:-.035em;font-weight:500;margin:40px 0 12px}}
h2{{font-size:24px;font-weight:500;letter-spacing:-.01em;margin:56px 0 12px;padding-top:24px;border-top:1px solid rgba(236,230,218,.12)}}
h3{{font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;font-size:24px;margin:28px 0 6px;color:#C29A5E}}
p,li{{color:#d9d2c4}}
.upd{{color:#a59f94;font-size:14px}}
code{{background:#1f1f21;padding:2px 6px;border-radius:6px;font-size:14px}}
footer{{max-width:820px;margin:0 auto;padding:24px 16px 48px;border-top:1px solid rgba(236,230,218,.12);font-size:13px;color:#a59f94}}
</style>
</head>
<body>
<header class="top"><a class="logo" href="{home}">{brand}</a><nav><a href="{home}">{back}</a><a href="{other}" hreflang="{olang}" lang="{olang}">{olabel}</a></nav></header>
<main>{body}</main>
<footer>© {year} {legal}</footer>
</body>
</html>
"""


def build():
    written = []
    for lang in ("en", "it"):
        t, g = gen(lang)
        out = render(SRC, t, g)
        with open(os.path.join(ROOT, t["page"]), "w", encoding="utf-8") as f:
            f.write(out)
        written.append(t["page"])

        body = open(os.path.join(HERE, f"privacy_{lang}.html"), encoding="utf-8").read()
        body = conditionals(body)
        pg = {"updated": UPDATED.strftime("%d/%m/%Y"), "brand": e(CFG["brand"]), "email": e(CFG["email"]),
              "company": e(CFG["legal"]["company"]), "address": e(CFG["legal"]["address"]), "vat": e(CFG["legal"]["vat"])}
        body = re.sub(r"\{\{@(\w+)\}\}", lambda m: pg[m.group(1)], body)
        page = PRIVACY_SHELL.format(
            lang=lang, title=strip(t["footer_privacy"]), brand=e(CFG["brand"]), home=t["page"],
            back="← " + ("Home" if lang == "en" else "Home"), other=COPY[t["other_lang"]]["privacy_page"],
            olang=t["other_lang"], olabel=t["other_lang_name"], body=body, year=UPDATED.year, legal=g["legal_line"])
        with open(os.path.join(ROOT, t["privacy_page"]), "w", encoding="utf-8") as f:
            f.write(page)
        written.append(t["privacy_page"])

    if CFG.get("site_url"):
        base = CFG["site_url"].rstrip("/")
        sm = ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
              'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n')
        for loc in ("", "it.html"):
            sm += (f'  <url><loc>{base}/{loc}</loc><lastmod>{UPDATED}</lastmod>'
                   f'<xhtml:link rel="alternate" hreflang="en" href="{base}/"/>'
                   f'<xhtml:link rel="alternate" hreflang="it" href="{base}/it.html"/></url>\n')
        sm += "</urlset>\n"
        open(os.path.join(ROOT, "sitemap.xml"), "w").write(sm)
        open(os.path.join(ROOT, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\nSitemap: {base}/sitemap.xml\n")
        written += ["sitemap.xml", "robots.txt"]
    else:
        open(os.path.join(ROOT, "robots.txt"), "w").write("User-agent: *\nAllow: /\n")
        written.append("robots.txt")
    print("Built:", ", ".join(written))


if __name__ == "__main__":
    build()
