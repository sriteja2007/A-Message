# 🤍 A Message — A Love Story (Aankhon Se Batana)

> *"She said it with her eyes, I said it with code."*

An interactive scrollytelling web experience set to the soulful song **"Aankhon Se Batana"** by **Dikshant**. Built with **GSAP**, fullscreen snap-scrolling, multi-layer parallax, and ambient canvas particle physics.

🌐 **Live Demo:** [https://sriteja2007.github.io/A-Message/](https://sriteja2007.github.io/A-Message/)

---

## ✨ The 8 Chapters of the Story

| Chapter | Overline (Lyrics) | Title | Subtext | Atmosphere |
| :---: | :--- | :--- | :--- | :--- |
| **01** | `TUM AANKHON SE BATANA` | **The Glance** | *a love told without words* | Golden sunset meadow, moonrise, initial glance |
| **02** | `TUM HALKI SI SHARMANA` | **The Blush** | *and I'm yours* | Soft pastel clouds, blooming cherry petals, shy smile |
| **03** | `HUM RAAH TAAKE BAITHE` | **The Wait** | *hoping for a sign* | Deep indigo starry night, Milky Way, glowing fireflies |
| **04** | `KOI IJAZAT DO` | **A Sign** | *she answers* | Sunlit golden hills, flowing white scarf in the breeze |
| **05** | `TUM HAATH THAAM LENA` | **Your Hand** | *and I'm complete* | Field of blooming wildflowers, holding hands together |
| **06** | `HUM TERE HO JAAYENGE` | **As One** | *and I'll be yours* | Twilight festival lights, embracing on the hillside |
| **07** | `BIN KUCH KAHE` | **The Café** | *eyes do the talking* | Cozy rainy café, warm mugs, laughing over coffee |
| **08** | `HUM KHAAMOSHI PADH LENGE` | **Silence** | *I'll read it all* | Glowing full moon, illuminated fairy tree, shooting star |

---

## 🚀 Features

- **Smooth Snap Scrollytelling:** Full-viewport (`100vh`) sections with magnetic snapping using CSS `scroll-snap` and GSAP power easing.
- **Ambient Canvas Engine:** High-performance 60fps canvas rendering drifting 3D cherry blossom & rose petals, glowing fireflies, and shooting stars.
- **Interactive Audio Companion:** Plays "Aankhon Se Batana" by Dikshant with an animated visualizer equalizer pill and browser autoplay unlocks.
- **Responsive & Cinematic Typography:** Editorial serif titles (`Playfair Display`, `Cinzel`) with high-contrast soft shadows and fluid scaling (`clamp()`).
- **Chapter Navigation:** Vertical glowing dot rail with chapter tooltips and keyboard controls (`ArrowDown`/`ArrowUp`/`Space`).
- **Parallax Depth:** Subtle mouse-tracking parallax on desktop and Ken Burns scale animations on active slides.

---

## 🛠️ Tech Stack

- **HTML5 & CSS3** (CSS Grid, Flexbox, Scroll Snap, Viewport Units, Backdrop Filter)
- **JavaScript (ES6+)**
- **GSAP (GreenSock Animation Platform 3.12)**
- **HTML5 Canvas 2D API**
- **Audio API** (AAC / WebM dual container fallback)

---

## 💻 Local Preview

To run locally, you can serve the directory with any static server:

```bash
# Python
python -m http.server 3000

# or Node.js / npx
npx serve .
```

Open `http://localhost:3000` in your browser.

---

## 📜 Credits

- **Song:** *Aankhon Se Batana* — Dikshant
- **Concept:** Inspired by creative coding reels & scrollytelling art
- **Created by:** [SriTeja](https://github.com/sriteja2007)
