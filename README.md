# Lusion About Section — React Component

## Screenshot-Accurate Animation Breakdown

### State 1 (your screenshot 1)
- Card sits LEFT side, flat rectangle, rounded corners (~16px)
- Blue C-arc SVG behind the card on the left
- Blue-tinted flower/botanical photo inside card
- Right side: eyebrow + animated heading + paragraph + "ABOUT US" pill

### State 2 (your screenshot 2)  
- Card SHEARS: left edge moves UP, right edge moves DOWN → parallelogram shape
- Card content cross-fades to animated vortex/portal (canvas 2D)
- Blue C-arc disappears, replaced by a long WAVY BLUE RIBBON across the top
- Chromatic aberration (CSS drop-shadow RGB split) scales with scroll speed
- Card has grown slightly in size, moved toward center

### State 3 (your screenshot 3)
- Card is FULL WIDTH, skew returns to 0 (flat)
- "PLAY ▶ REEL" text overlay appears
- Blue sky + red curved 3D ribbon background
- 10 cross (+) markers appear around card border
- Wavy ribbon completely gone

---

## Install (copy-paste)

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

### tailwind.config.js
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

### File placement
```
src/
  LusionAboutSection.jsx   ← paste here
  App.jsx                  ← replace with provided
  index.css                ← replace with provided
  main.jsx                 ← untouched (Vite default)
```

No Three.js needed. No GSAP needed. Pure React + CSS transforms + Canvas 2D.

---

## Customization

| What | Where | How |
|------|-------|-----|
| Skew angle | `T.skewY = -18 * skewPeak` | Change `-18` (degrees) |
| Scroll speed | `style={{ height: "300vh" }}` | `400vh` = slower |
| Card image | `card-flower` div | Replace inner SVG with `<img>` |
| Ribbon path | `<path d="M -50 160 C...` | Edit SVG path |