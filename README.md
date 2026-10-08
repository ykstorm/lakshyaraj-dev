# lakshyaraj-dev

My personal site and portfolio: [lakshyaraj-dev.vercel.app](https://lakshyaraj-dev.vercel.app).

A Next.js 16 App Router site. The hero is a world drawn entirely in code on a
canvas, with a working terminal in front of it. The rest of the page is plain
server-rendered HTML: project stories, live proof from npm and GitHub, and
contact. Dark by default, keyboard-navigable, and every animation has a
`prefers-reduced-motion` still frame.

## The hero world

[`components/world/`](components/world) draws an ASCII mountain range on
Canvas 2D. No images, no WebGL: every glyph is computed each frame.

- Seeded. One 32-bit seed sets every parameter of the range
  ([`biomes.ts`](components/world/biomes.ts)): ridged, domain-warped noise you
  fly over, and the sky of stars above it. The same seed always draws the same
  range, on every screen; a small or touch screen only shows fewer stars.
- Depth. The terrain is rendered like a voxel-space engine
  ([`engine.ts`](components/world/engine.ts)): each column marches front to
  back through the heightfield, so nearer ridges hide farther ones and every
  cell knows its depth. Cells are classified as skyline, inner ridge, contour or
  open ground, and lines get slope-aware glyphs (`/ \ _ ^ -`). Fog and glyph
  size fall off with distance, and the camera drifts with the cursor.
- Physics. The cursor pushes glyphs through a spring field and they settle
  back. A click sends a ring outward; disturbed glyphs show in the accent
  colour while they move.
- The terminal. The hero terminal takes nine commands: `help`, `whoami`, `ls`,
  `cat`, `open`, `cd`, `stack`, `contact` and `clear`.
- Cheap. Glyphs are pre-rendered into a sprite atlas, so a frame is a run of
  `drawImage` calls. The physics steps at a fixed 60 Hz. The canvas and its
  engine are a lazy client chunk (`next/dynamic`, no SSR), so the hero's text
  paints first as server HTML. A Lighthouse mobile run picked the pitch
  paragraph as the LCP element, not the headline, because its text box is the
  larger of the two (at 412 px wide, about 41,000 px² against 22,000). The world
  pauses off-screen and in hidden tabs, and small or touch screens get fewer
  stars at a lower pixel ratio.
- Reduced motion. One still frame of the same world. No loop, no pointer
  field, no waves, and the terminal intro appears at once instead of typing.

Adapted techniques, credited in the source:
[ThreeUI](https://github.com/MengTo/threeui) (MIT, Meng To) for the contour
bands of its Topo Field, and [Canvas UI](https://canvasui.dev) (MIT + Commons
Clause, David Haz) for the ring and pointer easing of its Force Field. These are
re-implementations written for this site, not copies of either library's
components.

## Live proof

[`lib/proof.ts`](lib/proof.ts) fetches on the server when the page is built,
and the page revalidates at most once an hour:

- the latest published version of each `@ykstormsorg/*` package on npm, and
  its downloads in the last week,
- check runs on the latest commit to `main` for each project repository, and
  its stars and forks,
- a commit calendar summed from each of my public repositories.

Nothing is typed in. When a request fails, the page prints the URL that failed
and why, instead of a stale or invented number. GitHub allows 60
unauthenticated requests an hour; set an optional read-only `GITHUB_TOKEN` to
raise that limit. Without one, a build makes two GitHub requests per project
repository, one to list my repositories, and one to three per public
repository for the commit calendar (three when GitHub is still computing its
stats).

## Routes

`/` · `/now` · `/resume` · `/projects/[slug]`

Project pages are markdown in [`content/`](content), rendered with
`react-markdown` (raw HTML in a content file is escaped, never injected).

## Run locally

```bash
npm install
npm run dev         # http://localhost:3000
npm run lint
npm run type-check
npm test            # node --test on the pure modules, Node 22.18 or later
npm run build       # production build, fetches the live proof
```

## Structure

```
app/              routes, metadata, sitemap, robots, OpenGraph image
components/world/ the hero range: world, engine, glyph atlas, noise, seeds
components/       hero, proof, page chrome, markdown, terminals, cards
content/          markdown for project pages
data/             project list and the "now" snapshot
lib/              content loading, project links, live proof, share cards
tests/            node --test checks for the world, the footer name, share text
```

---

Built by Lakshyaraj Singh Rao, a full-stack developer with a backend focus.
[Portfolio](https://lakshyaraj-dev.vercel.app) · [GitHub](https://github.com/ykstorm) · [npm](https://www.npmjs.com/~ykstormsorg)
