# Happy's Stork Lounge & Liquor Store — Website

A high-end, ultra-smooth marketing site for **Happy's Stork Lounge & Liquor Store**,
a North Bay Village (Miami) nightlife landmark established in **1953**.

> *Miami Nights Done Right Since 1953 — Lounge · Local · Late Night.*

## ✨ Design

Dark luxury nightlife aesthetic — black & charcoal with deep-gold accents, Miami
neon highlights (magenta / cyan), glassmorphism, cinematic gradient lighting and
film grain. Bold modern display type (**Syne**), clean UI text (**Inter**) and an
elegant serif accent (**Cormorant Garamond**).

## 🧭 Pages

Every primary nav item and CTA is a real hyperlink to its own page:

| Page | File | What's inside |
|------|------|----------------|
| Home | `index.html` | Cinematic hero, marquee, story, experience, offerings, delivery, location & CTA |
| Story | `about.html` | Legacy storytelling + history timeline since 1953 |
| Experience | `experience.html` | Lounge · Social Atmosphere · Entertainment & Sports |
| Offerings | `offerings.html` | Curated Selection · Premium Spirits · Late-Night Convenience + food partnerships |
| Delivery | `delivery.html` | Fast local delivery, how it works, coverage |
| Visit | `location.html` | Embedded map, full hours (open 'til 5 AM), directions |
| Contact | `contact.html` | Modern contact form + details — *"Pull Up Tonight"* |

## ⚡ Features

- **Apple-style smoothness** — smooth scroll, scroll-progress bar, eased transitions
- **Scroll-triggered reveals** via `IntersectionObserver` (with stagger)
- **Parallax** hero layers + drifting gradient orbs
- **Animated navbar** — transparent → frosted glass on scroll
- **Hover glow** cursor-tracking light on cards, magnetic buttons, image zoom/transitions
- **Custom cursor**, animated counters, film grain, neon marquee, preloader
- **Today's hours** auto-highlighted based on the visitor's day
- Fully **responsive / mobile-first** with a full-screen mobile menu
- Respects `prefers-reduced-motion`

## 🛠 Tech

Plain **HTML + CSS + vanilla JS** — no build step, no framework, no dependencies.
Cinematic backgrounds are CSS/SVG-driven (with gradient fallbacks under every photo),
so the site loads fast and never shows a broken asset.

```
.
├── index.html
├── about.html · experience.html · offerings.html · delivery.html · location.html · contact.html
└── assets/
    ├── css/style.css      # design system
    └── js/main.js         # interactions
```

## ▶️ Run locally

It's a static site — open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## 📍 Business details

- **Address:** 1624 79th St Causeway, North Bay Village, FL 33141
- **Phone:** (305) 865-3621
- **Hours:** Mon–Fri 11 AM – 5 AM · Sat–Sun 10 AM – 5 AM (open 'til 5 AM daily)
- **Instagram:** [@happystorklounge_](https://www.instagram.com/happystorklounge_/)

---

*Drink responsibly · 21+ · Built as a premium Miami nightlife brand experience.*
