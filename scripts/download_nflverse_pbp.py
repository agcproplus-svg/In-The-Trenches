#!/usr/bin/env python3
"""Download play_by_play CSVs from nflverse releases for given seasons.
Usage: python scripts/download_nflverse_pbp.py 2019 2020 2021
Files will be saved to data/pbp/play_by_play_{year}.csv.gz
"""
import sys, os, urllib.request
BASE = 'https://github.com/nflverse/nflverse-data/releases/download/pbp/play_by_play_{year}.csv.gz'
outdir = 'data/pbp'
os.makedirs(outdir, exist_ok=True)
years = sys.argv[1:] or [str(y) for y in range(2019, 2025)]
for y in years:
    url = BASE.format(year=y)
    out = os.path.join(outdir, f'play_by_play_{y}.csv.gz')
    print('Downloading', url, '->', out)
    try:
        urllib.request.urlretrieve(url, out)
    except Exception as e:
        print('Failed to download', url, e)
