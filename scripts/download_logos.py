#!/usr/bin/env python3
"""Download logos listed in logo-urls.json into src/assets/logos/"""
import json, os, sys, urllib.request, pathlib
def main():
    src = 'logo-urls.json' if os.path.exists('logo-urls.json') else 'logo-urls.example.json'
    print('Using', src)
    with open(src,'r') as f:
        urls = json.load(f)
    outdir = 'src/assets/logos'
    os.makedirs(outdir, exist_ok=True)
    for code, url in urls.items():
        try:
            ext = os.path.splitext(url)[1] or '.png'
            out = os.path.join(outdir, f"{code}{ext}")
            print('Downloading', code, url)
            urllib.request.urlretrieve(url, out)
        except Exception as e:
            print('Failed to download', code, url, '->', e)
if __name__=='__main__':
    main()
