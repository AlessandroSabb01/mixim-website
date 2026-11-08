#!/usr/bin/env python3
"""Converte le foto (originali + versioni HD da Higgsfield) in WebP responsive.

uso: python3 scripts/images.py <cartella_originali> <cartella_upscale> <upscale.json>
- cartella_upscale contiene <indice>.png prodotti dall'upscale 2K
- genera src/assets/img/<nome>-<larghezza>.webp + manifest.json
"""
import json, os, re, sys
from PIL import Image, ImageFilter, ImageOps

RAW, UP, LIST = sys.argv[1], sys.argv[2], sys.argv[3]
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "img")
os.makedirs(OUT, exist_ok=True)
WIDTHS = [480, 960, 1280, 1920]
RENAME = {
    "hf-20260117-181558-53e20bd6-caeb-4049-b9bb-6fb431f12258": "villa-borghese",
    "chatgpt": "hero-team",
    "chatgpt-2": "hero-contatti",
    "chatgpt-3": "hero-studio",
    "img-5962-2": "hero-home",
    "whatsapp-image-2026-07-21-at-10-36-09-pm-scaled": "duo-whatsapp",
    "ae35b98d-fdb1-4da9-9a43-c5931685eb44": "laser",
    "aef08a42-2f7b-48c5-989d-446270c0685d": "pedodonzia",
    "img-0740-e1766053359409": "invisalign-diamond",
    "img-0756-e1782622605354": "chirurgia-orale",
    "c34358622-img-0726": "igiene-orale",
    "imgi-5-af92f19c6-img-0733": "itero-scan",
    "0b5c23d9b-img-0742-1": "duo-studio",
    "378c14766-img-59622": "team-gruppo",
}

def slug(fname, used):
    base = fname.split("_", 2)[2] if re.match(r"^\d{4}_\d{2}_", fname) else fname
    stem, ext = os.path.splitext(base)
    s = re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")
    s = RENAME.get(s, s)
    if s in used:
        s = s + ("-" + fname[:4] if not s.endswith(fname[:4]) else "") + ("-png" if ext == ".png" else "")
    used.add(s)
    return s

items = json.load(open(LIST))
extra = ["2026_01_faccette.jpg", "2026_07_WhatsApp-Image-2026-07-21-at-10.36.09-PM-scaled.jpeg"]
manifest, used = {}, set()
jobs = [(i, it["f"]) for i, it in enumerate(items)] + [(None, f) for f in extra]
for idx, f in jobs:
    name = slug(f, used)
    up = os.path.join(UP, f"{idx}.png") if idx is not None else None
    src = up if up and os.path.exists(up) else os.path.join(RAW, f)
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    hd = src == up
    if not hd:
        # ritocco leggero per le foto non ingrandite
        im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=3))
    W, H = im.size
    widths = [w for w in WIDTHS if w <= W] or [W]
    if W > widths[-1] and W < 1920 and W - widths[-1] > 200:
        widths.append(W)
    for w in widths:
        h = round(H * w / W)
        im.resize((w, h), Image.LANCZOS).save(os.path.join(OUT, f"{name}-{w}.webp"), "WEBP", quality=80, method=6)
    manifest[name] = {"w": W, "h": H, "widths": widths, "hd": hd, "source": f}
    print(f"{'HD ' if hd else '   '}{name:55s} {W}x{H} -> {widths}")

# Loghi (ritagliati, WebP + PNG per schema/OG)
for f, name in [("2025_10_new-logo.png", "logo-blue"), ("2025_10_Pristine-White-Dental-Studio-Logo.png", "logo-white")]:
    im = Image.open(os.path.join(RAW, f)).convert("RGBA")
    im = im.crop(im.getbbox())
    w = 720
    im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, f"{name}.webp"), "WEBP", quality=92, method=6)
    im.save(os.path.join(OUT, f"{name}.png"), optimize=True)
    manifest[name] = {"w": im.width, "h": im.height, "widths": [w], "logo": True}
g = Image.open(os.path.join(RAW, "2025_12_googlelogo_color_92x30dp.png")).convert("RGBA")
g.save(os.path.join(OUT, "google-logo.webp"), "WEBP", quality=95)
fav = Image.open(os.path.join(RAW, "2025_11_favicon.png")).convert("RGBA")
fav.save(os.path.join(OUT, "favicon.png"))
json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w"), indent=1)
print(len(manifest), "immagini")
