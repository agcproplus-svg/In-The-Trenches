# In the Trenches

A Strat-o-matic-inspired NFL game built with React + Vite + Tailwind.

## What's included
- React single-page app with ESPN-style UI scaffold.
- Team/roster generation matching requested position counts.
- Player cards with percentile-style results (sample data).
- Play resolution engine with weighted percentile dice and CPU play selection.
- Field view with ball marker, play log, clock rules, and basic scoring.
- Animations placeholders and audio placeholders.
- Ready to deploy on GitHub Pages (instructions below).

## How to run locally
1. Install dependencies:
```bash
npm install
```
2. Start dev server:
```bash
npm run dev
```
3. Build for production:
```bash
npm run build
```

## Logos / Assets
This repo includes placeholders for team logos in `src/assets/logos/`. Replace them with real images (named by team code, e.g. `NE.png`) or point the app to remote URLs.

## Notes
- The included player percentile data (`src/data/player_cards.json`) is sample/demo data. Replace or expand with historical data if you have it.
- CPU AI is heuristic-based and can be further improved.
- This is a starting point for the full project you described. If you'd like, I can:
  - Integrate real NFL logos (I will need links or permission to fetch).
  - Expand the percentile tables with historical/statistical data.
  - Add richer animations, audio, and UI polish.

