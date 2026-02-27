# InvAD Project Page

Modern project website for:

**InvAD: Inversion-based Reconstruction-Free Anomaly Detection with Diffusion Models**  
Accepted at CVPR 2026 (main conference)

## Local Run

```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Railway

1. Push this repository to GitHub.
2. In Railway, click `New Project` -> `Deploy from GitHub repo`.
3. Select this repository.
4. Railway will use `railway.json` and run:
   - Build: Nixpacks
   - Start: `npm run start`
5. Add a public domain from Railway `Settings` -> `Domains`.

No extra environment variables are required.

## Content Sources

- Figures: `figs/` (converted PNG assets are in `assets/figs/`)
- Raw paper TeX: `docs/`
- Paper: <https://arxiv.org/abs/2504.05662>
- Code repository: <https://github.com/SkyShunsuke/InversionAD>

## File Structure

- `index.html`: project page markup
- `styles.css`: visual style and responsive layout
- `script.js`: interactions (figure switch, charts, BibTeX copy)
- `server.mjs`: zero-dependency Node static server (Railway-compatible)
- `railway.json`: Railway deployment settings
