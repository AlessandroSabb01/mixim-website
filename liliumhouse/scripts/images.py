#!/usr/bin/env python3
"""Convert the original liliumhouse.com photos to responsive WebP.

Original photos only: no upscale, no AI edits, no sharpening.
usage: python3 -I scripts/images.py <folder_with_originals>
writes src/assets/img/<name>-<width>.webp + manifest.json
"""
import json, os, sys
from PIL import Image, ImageOps

RAW = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "assets", "img")
os.makedirs(OUT, exist_ok=True)
WIDTHS = [480, 960, 1280, 1920]

NAMES = {
    "Giotto_Picture-11.jpg": "rome-living-room",
    "Giotto_Picture-10.webp": "rome-kitchen-dining",
    "Giotto_Picture-3.webp": "rome-bedroom",
    "Giotto_Picture-12.webp": "rome-bathroom",
    "Giotto_Picture-13.webp": "rome-room-garden",
    "Giotto_Picture-14.webp": "rome-kitchenette",
    "Giotto_Picture-15.webp": "rome-living-blue",
    "Giotto_Picture-16.webp": "rome-bedroom-double",
    "Creta_Picture-1.webp": "crete-bedroom",
    "Creta_Picture-2.webp": "crete-daybed",
    "Creta_Picture-4.webp": "crete-bathroom",
    "Creta_Picture-7.webp": "crete-living-room",
    "Creta_Picture-12.webp": "crete-dining",
    "Creta_Picture-13.webp": "crete-bougainvillea",
    "hf_20260210_184352_44086141-3c7a-4c26-a331-2509e145d6cb.webp": "rome-rooftops",
    "hf_20260210_184732_bf11b955-bfe2-4bee-874b-f229d4c17d3a.webp": "rome-dome-keyhole",
    "hf_20260210_185047_79d8437a-0836-41a1-83fb-b73868a9ce54.webp": "rome-san-saba",
    "hf_20260210_185151_da06941b-1a93-40d1-a546-083b62713271.webp": "rome-skyline",
    "hf_20260210_185509_a5b37ece-7c35-47f1-a7f1-021dab6f1ebe.webp": "rome-colosseum",
    "hf_20260210_185553_f482a919-7ede-45cd-a5aa-55f3ee19add7.webp": "rome-vatican",
    "hf_20260210_190948_4cf8e198-69de-4f79-929b-a055131ad0e0.webp": "rome-aventino-street",
    "hf_20260210_194108_bbcf2182-2642-473a-8866-cfe9d1e8615a.webp": "crete-taverna",
    "hf_20260210_195105_6b636ce1-505b-4d8b-a7f1-76a5ca698b8b.webp": "crete-village",
    "hf_20260210_195340_1d025224-2810-44be-8a5f-c27081f67bf9.webp": "crete-harbour",
    "d55b23f75_ebd5bc7b-b0ff-47a5-a352-f50bb932629d.jpg": "crete-beach",
    "69ce2ce3a_9a33c1b8-a635-4c8e-9156-9c8b8e424451.jpg": "crete-sunset",
    "89aa7d6ac_143e6ce0-184d-4207-9cce-61610b39c0a9.jpg": "crete-coast-road",
    "photo-1531572753322-ad063cecc140.jpg": "rome-st-peters-aerial",
    "photo-1601581875309-fafbf2d3ed3a.jpg": "island-seafront",
}

manifest = {}
for src, name in NAMES.items():
    im = ImageOps.exif_transpose(Image.open(os.path.join(RAW, src))).convert("RGB")
    W, H = im.size
    widths = [w for w in WIDTHS if w <= W] or [W]
    if W not in widths and W - widths[-1] > 100:
        widths.append(W)
    for w in widths:
        im.resize((w, round(H * w / W)), Image.LANCZOS).save(os.path.join(OUT, f"{name}-{w}.webp"), "WEBP", quality=80, method=6)
    manifest[name] = {"w": W, "h": H, "widths": widths, "source": src}
    print(f"{name:26s} {W}x{H} -> {widths}")

fav = Image.open(os.path.join(RAW, "cropped-FAVICON_LiliumHouse.png")).convert("RGBA")
fav.resize((192, 192), Image.LANCZOS).save(os.path.join(OUT, "favicon.png"))
fav.resize((180, 180), Image.LANCZOS).save(os.path.join(OUT, "apple-touch-icon.png"))
json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w"), indent=1)
print(len(manifest), "images")
