<<<<<<< HEAD
# Platformer Adventure — Stage 2 (Fixed)

Phaser 3 + Vite. Optimized for mobile landscape.

## Fixes in this build
- Fixed game freeze / stuck when pressing PLAY (texture spam, missing error handling, event leaks)
- Splash "TAP TO PLAY" → optional fullscreen → landscape check
- CSS separated into `src/style.css`
- Canvas fills viewport better
- Animated home menu (stars, floating platforms, idle hero)
- Single-fire menu buttons (no double-start)

## Run
```bash
npm install
npm run dev
```

## Build
=======
# Platformer Adventure

Original 2D browser platformer built with **Phaser 3** + **Vite**.

**Stage 1** features:
- Left / right movement
- Jump + gravity
- Collision with platforms & ground
- One complete side-scrolling level
- Camera follows the player
- Keyboard + on-screen touch controls
- Start menu
- Level indicator + goal flag

No coins, shops, localStorage, accounts, backend, or payments.

---

## Requirements

- Node.js 18+ (LTS recommended)
- npm

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Controls

| Action  | Keyboard             | Touch          |
|---------|----------------------|----------------|
| Move    | ← →  or  A / D       | ◀ ▶ buttons    |
| Jump    | Space / W / ↑        | ▲ button       |
| Restart | R                    | —              |

## Project Structure

```
platformer-game/
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── public/                 # static assets (empty for now)
└── src/
    ├── main.js             # Phaser game config
    └── scenes/
        ├── MenuScene.js    # Start screen
        └── GameScene.js    # Main gameplay
```

## Build for Production

>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
```bash
npm run build
```

<<<<<<< HEAD
`vite.config.js` uses `base: './'` for Vercel / GitHub Pages.

## Controls
Keyboard: A/D or arrows, Space/W jump, R restart  
Touch: left/right buttons + jump button

## Notes
- Top Up is DEMO only (TEST +20 diamonds button)
- Data stored in localStorage key `platformer_adventure_save_v2`
=======
Output is written to the `dist/` folder. Serve it with any static file server:

```bash
npx serve dist
# or
npm run preview
```

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `platformer-adventure`).
2. Push this project:

```bash
git init
git add .
git commit -m "Initial commit - Platformer Adventure Stage 1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/platformer-adventure.git
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to repository **Settings → Pages**
   - Source: **GitHub Actions** or **Deploy from a branch**
   - If using branch: select `gh-pages` (after build) or use a workflow.

**Recommended: Vite base is already set to `./`** so relative paths work when the site is served from a subfolder or root.

### Simple GitHub Actions workflow (optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

After the first successful run the game will be available at:

`https://YOUR_USERNAME.github.io/platformer-adventure/`

## Deploy to Vercel

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import the repository.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy.

The game will get a public URL immediately.

## Notes

- All graphics (player, platforms, background, flag) are generated at runtime with Phaser Graphics — no external image files required.
- Gravity, jump force, and movement speed can be tuned inside `src/scenes/GameScene.js`.
- Touch buttons are always visible (useful for testing on desktop too).
- This is Stage 1 only. Future stages can add coins, enemies, more levels, etc.

## License

Free to use, modify, and distribute for personal or commercial projects. Attribution appreciated but not required.
>>>>>>> 0def86fbacae6505c1ad324ac0f0dc35d17b7638
