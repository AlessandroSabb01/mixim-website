#!/usr/bin/env bash
# Builds the site and packs a zip for Hostinger "Deploy Web App" (which needs a Vite project).
# Usage: bash build/hostinger/pack.sh   ->  mixim-hostinger.zip in the site folder
set -euo pipefail
SITE="$(cd "$(dirname "$0")/../.." && pwd)"
HERE="$SITE/build/hostinger"
OUT="$SITE/mixim-hostinger.zip"
STAGE="$(mktemp -d)"

python3 "$SITE/build/build.py"

cp "$HERE/package.json" "$HERE/vite.config.js" "$STAGE/"
cp "$SITE"/index.html "$SITE"/it.html "$SITE"/privacy.html "$SITE"/privacy-it.html "$STAGE/"
mkdir -p "$STAGE/public"
cp -r "$SITE"/img "$SITE"/media "$SITE"/js "$SITE"/fonts "$STAGE/public/"
cp "$SITE"/favicon.ico "$SITE"/icon-512.png "$SITE"/apple-touch-icon.png "$SITE"/og-image.jpg "$SITE"/robots.txt "$SITE"/.htaccess "$STAGE/public/"
[ -f "$SITE/sitemap.xml" ] && cp "$SITE/sitemap.xml" "$STAGE/public/"

( cd "$STAGE" && zip -qr "$OUT.tmp" . )
mv "$OUT.tmp" "$OUT"
echo "Packed: $OUT ($(du -h "$OUT" | cut -f1))"
