# Platformer Adventure — Stage 2

Original 2D browser platformer (Phaser 3 + Vite).  
Optimized for **mobile landscape** (Android / iOS browsers).

## Features (Stage 2)

- Mobile landscape layout + portrait “rotate phone” message
- Procedural / random platforms & gaps each new session (fair, beatable)
- Game Over on fall + Level Complete at flag
- Score (distance-based) + Best Score (localStorage)
- Session Coins → awarded once to Total Coins on Game Over
- Diamond (DM) demo currency
- Shop (skins & cosmetics with Coin / Diamond prices)
- Inventory + Equip skin (visible in-game)
- Main Menu with balances & Best Score
- Settings (music/SFX toggles placeholder, controls hint, Reset Data with confirm)
- Top Up page (DEMO only — no real payment; TEST button for +20 💎)
- Touch controls (left/right + jump) + keyboard
- Camera follow, gravity, collision
- All data via localStorage (no backend)

No login, no real payments, no backend, no database.

## Quick Start

```bash
npm install
npm run dev
```

Open the URL (usually http://localhost:5173).  
Best experienced in **landscape** on a phone.

## Controls

| Action  | Keyboard          | Touch              |
|---------|-------------------|--------------------|
| Move    | ← → or A D        | ◀ ▶ (left side)    |
| Jump    | Space / W / ↑     | ▲ (right side)     |
| Restart | R (during play)   | Restart button     |

## Project Structure

```
platformer-game/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
├── public/
└── src/
    ├── main.js
    ├── data/
    │   └── ShopItems.js
    ├── utils/
    │   └── Storage.js
    └── scenes/
        ├── MenuScene.js
        ├── GameScene.js
        ├── ShopScene.js
        ├── InventoryScene.js
        ├── SettingsScene.js
        └── TopUpScene.js
```

## Build & Deploy

```bash
npm run build        # → dist/
npm run preview
```

**Vite `base: './'`** is already set for GitHub Pages / Vercel subpath compatibility.

### Vercel
1. Import the GitHub repo
2. Framework: Vite
3. Build: `npm run build`
4. Output: `dist`
5. Deploy

### GitHub Pages
Use a workflow that builds and uploads `dist`, or enable Pages on the `gh-pages` branch after build.

## localStorage Keys

Single key: `platformer_adventure_save_v2`  
Stores: bestScore, totalCoins, totalDiamonds, ownedItems, equippedSkin, settings, sessionHistory.

Data can be lost if the browser clears storage and can be modified by the user. This is intentional for a free offline-capable demo.

## Notes

- All art is generated with Phaser Graphics (no external image assets required).
- Procedural levels use a seed per session so the layout is stable until Restart / new game.
- Coin reward is applied exactly once when the session ends (Game Over or Level Complete).
- Top Up is labeled DEMO / TEST ONLY — no real payment flow.

## License

Free to use and modify. Attribution appreciated but not required.
