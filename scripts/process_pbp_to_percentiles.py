#!/usr/bin/env python3
"""Process downloaded play_by_play CSVs into simplified percentile tables for the game.
This is a heuristic: it computes distributions for passing completion, pass yards, rush yards by position groups.
Outputs: src/data/player_cards.json (overwrites sample)
"""
import os, gzip, pandas as pd, json, glob
pbp_files = glob.glob('data/pbp/play_by_play_*.csv.gz')
if not pbp_files:
    print('No pbp files found in data/pbp/. Run scripts/download_nflverse_pbp.py first.')
    raise SystemExit(1)
df_list = []
for f in pbp_files:
    print('Loading', f)
    df = pd.read_csv(f, compression='gzip', low_memory=False)
    df_list.append(df)
pbp = pd.concat(df_list, ignore_index=True)
print('Total plays loaded:', len(pbp))
# Simplified stats: passing yards distribution for passes; rushing yards distribution for rushes
passes = pbp[pbp['play_type']=='pass'].copy()
rushes = pbp[pbp['play_type']=='run'].copy()
# Create basic percentiles for pass yards and rush yards
pass_yards = passes['yards_gained'].dropna()
rush_yards = rushes['yards_gained'].dropna()
def quantile_buckets(series):
    q = series.quantile([0.25,0.5,0.75,0.9,0.99]).to_dict()
    return q
out = {
    'meta': {'source_files': pbp_files, 'generated_from': len(pbp_files)},
    'pass_yards_percentiles': quantile_buckets(pass_yards),
    'rush_yards_percentiles': quantile_buckets(rush_yards)
}
# Create simple player_cards.json structure with percentile buckets translated into weights
player_cards = {
  'QB': [
    {'label':'Incomplete','weight':20,'yards':0},
    {'label':'Short Completion','weight':35,'yards':int(out['pass_yards_percentiles'][0.5] if 0.5 in out['pass_yards_percentiles'] else 8)},
    {'label':'Medium Completion','weight':30,'yards':int(out['pass_yards_percentiles'][0.75] if 0.75 in out['pass_yards_percentiles'] else 15)},
    {'label':'Big Play','weight':10,'yards':int(out['pass_yards_percentiles'][0.9] if 0.9 in out['pass_yards_percentiles'] else 30)},
    {'label':'Interception','weight':5,'yards':0}
  ],
  'RB': [
    {'label':'Tackle for loss','weight':5,'yards':-2},
    {'label':'Short gain','weight':55,'yards':int(out['rush_yards_percentiles'][0.5] if 0.5 in out['rush_yards_percentiles'] else 3)},
    {'label':'Medium gain','weight':30,'yards':int(out['rush_yards_percentiles'][0.75] if 0.75 in out['rush_yards_percentiles'] else 7)},
    {'label':'Breakaway','weight':10,'yards':int(out['rush_yards_percentiles'][0.9] if 0.9 in out['rush_yards_percentiles'] else 20)}
  ]
}
os.makedirs('src/data', exist_ok=True)
with open('src/data/player_cards.json','w') as f:
    json.dump(player_cards, f, indent=2)
print('Wrote src/data/player_cards.json')
