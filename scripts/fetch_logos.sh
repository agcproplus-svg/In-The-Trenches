#!/usr/bin/env bash
# fetch_logos.sh
# Usage: scripts/fetch_logos.sh logo-urls.json
# Example logo-urls.json format:
# {
#   "NE": "https://example.com/NE.png",
#   "KC": "https://example.com/KC.png"
# }
#
# This script downloads PNG/SVG logos into src/assets/logos/
set -e
if [ -z "$1" ]; then
  echo "Usage: $0 path/to/logo-urls.json"
  exit 1
fi
JSON="$1"
DEST_DIR="src/assets/logos"
mkdir -p "$DEST_DIR"
python3 - <<PY
import json,sys,os,urllib.request
js = json.load(open("$JSON"))
for code,url in js.items():
    ext = os.path.splitext(url)[1]
    if ext == '': ext = '.png'
    out = os.path.join("$DEST_DIR", f"{code}{ext}")
    print(f"Fetching {url} -> {out}")
    try:
        urllib.request.urlretrieve(url, out)
    except Exception as e:
        print('Failed to fetch', url, e)
PY
