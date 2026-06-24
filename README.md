# lakshyaraj-dev

My personal site and engineering portfolio — **[lakshyaraj-dev.vercel.app](https://lakshyaraj-dev.vercel.app)**.

A Next.js 16 App Router site built to feel like a terminal, not a template:
hand-written canvas physics, spring-animated cards, an interactive shell, and a
"shipped to npm" proof strip that pulls live package versions. Dark by default,
fully keyboard-navigable, and respectful of `prefers-reduced-motion`.

## What's interesting in here

- **Interactive ASCII flow-field background** ([`ascii-background.tsx`](components/ui/ascii-background.tsx)) — a grid of monospace glyphs driven by a sum-of-sines flow field plus a tiny verlet spring system: the cursor repels nearby glyphs, which spring back with damping; clicking fires a radial shockwave. Brand-tinted, ~30fps, `pointer-events-none`. On touch / coarse-pointer devices it renders a single static frame (no rAF loop, no listeners) so phones don't pay for a physics sim.
- **Spring-physics tilt cards** ([`card-hover-effect.tsx`](components/ui/card-hover-effect.tsx)) — project cards tilt in 3D toward the cursor via `useSpring`/`useTransform`, lift on hover, and slide a shared-`layoutId` highlight behind the hovered one. Touch falls back to `whileTap`; reduced-motion disables tilt entirely.
- **Interactive terminal hero** ([`terminal-hero.tsx`](components/ui/terminal-hero.tsx)) — boots a typewriter intro then hands you a live prompt: `help`, `ls`, `cat <project>`, `open <name>`, `stack`, `contact`, `clear` all work. A static transcript lives in `<noscript>` for crawlers and no-JS.
- **Live npm proof strip** — fetches the current published versions of the `@ykstormsorg/*` packages, so the site can't claim a version it didn't ship.
- **GitHub contribution graph** ([`github-contributions.tsx`](components/ui/github-contributions.tsx)) and a terminal-styled contact block.

## Built for crawlers and Core Web Vitals

- Per-route `metadata`, a generated [`sitemap.ts`](app/sitemap.ts) + [`robots.ts`](app/robots.ts), a branded OpenGraph image rendered at the edge via `next/og` ([`opengraph-image.tsx`](app/opengraph-image.tsx)), and a JSON-LD `Person` block.
- Security headers (HSTS, frame-deny, nosniff, referrer + permissions policy) and Vercel Analytics + Speed Insights.
- `backdrop-filter` is disabled on touch devices, where compositing the canvas every frame is the expensive part.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · Framer Motion · next-themes · MDX blog · Vercel

## Routes

`/` · `/now` · `/uses` · `/resume` · `/blog` + `/blog/[slug]` · `/projects/[slug]`

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint, 0 warnings
```

## Structure

```
app/            App Router routes, metadata, sitemap/robots/OG image
components/ui/  canvas background, tilt cards, terminal, theme toggle, …
data/           projects, "now", "uses" content
content/blog/   MDX posts
```

---

Built by **Lakshyaraj Singh Rao** — backend / AI-infrastructure engineer.
[Portfolio](https://lakshyaraj-dev.vercel.app) · [GitHub](https://github.com/ykstorm) · [npm](https://www.npmjs.com/~ykstormsorg)
