#!/bin/sh
# Packs the site as a Vite project for Hostinger's "Deploy Web App" (it rejects plain HTML).
set -e
here=$(cd "$(dirname "$0")" && pwd); site="$here/../.."; tmp=$(mktemp -d)
cp "$here/package.json" "$here/vite.config.js" "$site/index.html" "$tmp/"
mkdir -p "$tmp/public" && cp -r "$site/img" "$site/media" "$site/js" "$tmp/public/"
(cd "$tmp" && zip -qr "$site/../emily-wedding-hostinger.zip" .)
echo "wrote emily-wedding-hostinger.zip"
