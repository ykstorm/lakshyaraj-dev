import { ImageResponse } from 'next/og';

// The share card, one layout for every page: a terminal prompt, a title, a line
// under it, a quieter note, and a small ASCII terrain that echoes the hero.
// next/og cannot read CSS variables, so these are the dark theme's tokens from
// app/globals.css written out (--background, --foreground, --muted-foreground,
// --accent); change them there and here together.
const INK = { background: '#0b0c0e', foreground: '#e9e6de', muted: '#8f8c83', accent: '#f2a93b' };

export const CARD_SIZE = { width: 1200, height: 630 };

export interface Card {
  prompt: string;
  title: string;
  line: string;
  note: string;
}

// The terrain is computed, so the card ships no image asset. Deterministic:
// same rows on every render.
const RAMP = ' .:-=+*#';
function terrainRows(cols: number, rows: number): string[] {
  const out: string[] = [];
  for (let y = 0; y < rows; y++) {
    let line = '';
    for (let x = 0; x < cols; x++) {
      const v =
        Math.sin(x * 0.31 + y * 0.12) * 0.5 +
        Math.sin(x * 0.07 - y * 0.41 + 1.7) * 0.35 +
        Math.sin((x + y) * 0.19 + 0.4) * 0.25;
      const fade = y / rows; // denser toward the bottom, like the hero's horizon
      const n = Math.max(0, Math.min(0.999, ((v + 1.1) / 2.2) * (0.35 + fade * 0.75)));
      line += RAMP[Math.floor(n * RAMP.length)];
    }
    out.push(line);
  }
  return out;
}

// next/og draws with its own sans-serif unless it is handed font files, and the
// terrain's columns only line up in a monospace face. JetBrains Mono is the
// site's mono font (app/layout.tsx); it is wider than a sans-serif, so the text
// sizes let the name and the pitch fit on one line each. Google Fonts answers a
// request that does not come from a browser with TrueType, which next/og reads.
// Fetched once per build worker; if it fails the card still renders, in the
// default face.
type CardFont = { name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' };
let fonts: Promise<CardFont[]> | undefined;

async function monoFont(weight: 400 | 700): Promise<CardFont> {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@${weight}`)).text();
  const src = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!src) throw new Error('no TrueType source in the Google Fonts CSS');
  const res = await fetch(src);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${src}`);
  return { name: 'JetBrains Mono', data: await res.arrayBuffer(), weight, style: 'normal' };
}

function loadFonts(): Promise<CardFont[]> {
  fonts ??= Promise.all([monoFont(400), monoFont(700)]).catch((err) => {
    console.warn(`share card: JetBrains Mono did not load (${err}); using the default face`);
    return [];
  });
  return fonts;
}

export async function renderCard({ prompt, title, line, note }: Card): Promise<ImageResponse> {
  const rows = terrainRows(34, 15);
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '72px',
          background: INK.background,
          color: INK.foreground,
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 720 }}>
          <div style={{ color: INK.accent, fontSize: 24 }}>{prompt}</div>
          <div style={{ fontSize: 58, fontWeight: 700, marginTop: 26, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 28, marginTop: 28, lineHeight: 1.3 }}>{line}</div>
          <div style={{ fontSize: 21, marginTop: 22, color: INK.muted, lineHeight: 1.45 }}>{note}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', color: INK.accent, fontSize: 15, lineHeight: 1.25, opacity: 0.85 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', whiteSpace: 'pre' }}>{r}</div>
          ))}
        </div>
      </div>
    ),
    { ...CARD_SIZE, fonts: await loadFonts() },
  );
}
