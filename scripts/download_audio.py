#!/usr/bin/env python3
import json, os, urllib.request
src = 'audio-urls.example.json' if not os.path.exists('audio-urls.json') else 'audio-urls.json'
with open(src) as f:
    urls = json.load(f)
out = 'src/assets/audio'
os.makedirs(out, exist_ok=True)
for name, url in urls.items():
    ext = os.path.splitext(url)[1] or '.mp3'
    dest = os.path.join(out, name + ext)
    try:
        print('Downloading', url, '->', dest)
        urllib.request.urlretrieve(url, dest)
    except Exception as e:
        print('Failed to download', url, e)
