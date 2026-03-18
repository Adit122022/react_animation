# Lusion Card — React + Tailwind + Three.js

Scroll-driven WebGL card animation with:

- Parabolic C-curve mesh warp (80×80 vertex grid)
- Chromatic aberration (RGB Y-split) reactive to scroll speed
- Z-axis depth pop on warp peaks
- Elastic Lerp "ooze back" when scrolling stops
- Animated heading (word-by-word slide-up on viewport entry)
- Ribbon tube that appears during mid-transition

---

## 📦 Installation

### 1. Create a new Vite + React project (skip if you have one)

```bash
npm create vite@latest my-app -- --template react
cd my-app
```

### 2. Install Tailwind CSS v3

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

Edit **tailwind.config.js**:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

Add to **src/index.css** (top of file):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Install Three.js

```bash
npm install three
```

### 4. Copy component files

Copy these 3 files into `src/components/`:

```
src/
  components/
    LusionCard.jsx       ← WebGL Three.js canvas
    AnimatedHeading.jsx  ← Word-by-word slide-up heading
    HeroSection.jsx      ← Full section (card left + text right)
```

### 5. Use in your App

```jsx
// src/App.jsx
import HeroSection from "./components/HeroSection";
import "./index.css";

export default function App() {
  return (
    <main>
      <HeroSection />
      {/* your other sections */}
    </main>
  );
}
```

### 6. Run

```bash
npm run dev
```

---

## 📁 File Overview

| File                  | Purpose                                                  |
| --------------------- | -------------------------------------------------------- |
| `LusionCard.jsx`      | Three.js WebGL renderer — parabolic warp, chroma, ribbon |
| `AnimatedHeading.jsx` | Word-split IntersectionObserver slide-up animation       |
| `HeroSection.jsx`     | Layout: sticky 250vh section, card left + text right     |

---

## 🎨 Customisation

### Change card texture

In `LusionCard.jsx`, replace the procedural `texData` loop with a `THREE.TextureLoader`:

```js
const tex = new THREE.TextureLoader().load("/your-image.jpg");
```

### Change heading text

In `HeroSection.jsx`:

```jsx
<AnimatedHeading text="Your custom heading here" ... />
```

### Adjust warp intensity

In `LusionCard.jsx`, find:

```js
s.bendT = midT * velSign * velMag;
```

Multiply by a larger number (e.g. `* 1.5`) for more aggressive warp.

### Adjust scroll distance

In `HeroSection.jsx`, change:

```jsx
style={{ height: "250vh" }}
```

`250vh` = how long the transition takes. Increase for a slower, more cinematic feel.

---

## ⚙️ Dependencies

```json
{
  "three": "^0.168.0",
  "tailwindcss": "^3.x",
  "react": "^18.x"
}
```

No other animation libraries needed.
