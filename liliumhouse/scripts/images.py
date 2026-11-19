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
    "hf_20260210_195105_6b636ce1-505b-4d8b-a7f1-76a5ca698b8b.webp": "crete-village",
    "69ce2ce3a_9a33c1b8-a635-4c8e-9156-9c8b8e424451.jpg": "crete-sunset",
    "photo-1531572753322-ad063cecc140.jpg": "rome-st-peters-aerial",
    # Client photos (Drive, Nov 2026)
    "drive-rome-18.jpg": "rome-g1-bathroom",
    "drive-rome-19.jpg": "rome-g1-bedroom",
    "drive-rome-20.jpg": "rome-g1-bedroom-2",
    "drive-rome-21.jpg": "rome-g1-bedroom-3",
    "drive-rome-12.jpg": "rome-g2-bathroom",
    "drive-rome-13.jpg": "rome-g2-bedroom",
    "drive-rome-14.jpg": "rome-g2-bedroom-2",
    "drive-rome-17.jpg": "rome-g2-dining",
    "drive-rome-15.jpg": "rome-g2-living",
    "drive-rome-16.jpg": "rome-g2-sofa-bed",
    "drive-rome-06.jpg": "rome-g3-bathroom",
    "drive-rome-02.jpg": "rome-g3-bedroom",
    "drive-rome-03.jpg": "rome-g3-bedroom-2",
    "drive-rome-05.jpg": "rome-g3-bedroom-3",
    "drive-rome-04.jpg": "rome-g3-kitchen",
    "drive-rome-01.jpg": "rome-g4-bathroom",
    "drive-rome-07.jpg": "rome-g4-bedroom",
    "drive-rome-08.jpg": "rome-g4-bedroom-2",
    "drive-rome-10.jpg": "rome-g4-bedroom-3",
    "drive-rome-09.jpg": "rome-g4-kitchenette",
    "drive-rome-11.jpg": "rome-g4-living",
    "drive-crete2-01.jpg": "crete2-entrance",
    "drive-crete2-02.jpg": "crete2-bedroom",
    "drive-crete2-03.jpg": "crete2-room",
    "drive-crete2-04.jpg": "crete2-daybed",
    "drive-crete2-05.jpg": "crete2-bathroom",
    "drive-crete2-06.jpg": "crete2-room-view",
    "drive-crete3-01.jpg": "crete3-kitchen",
    "drive-crete3-02.jpg": "crete3-room",
    "drive-crete3-03.jpg": "crete3-sofa",
    "drive-crete3-04.jpg": "crete3-bedroom",
    "drive-crete3-06.jpg": "crete3-kitchenette",
    "drive-crete-general-01.jpg": "crete-windsurf",
    "drive-crete-general-03.jpg": "crete-beach-rock",
    "drive-crete-general-04.jpg": "crete-seaside-taverna",
    "drive-crete-general-05.jpg": "crete-cave-view",
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
