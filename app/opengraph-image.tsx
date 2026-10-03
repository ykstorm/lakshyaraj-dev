import { ImageResponse } from 'next/og';

// Default (Node.js) runtime: the card is deterministic, so it is generated once
// at build time instead of on every request.
export const alt = 'Lakshyaraj Singh Rao, backend-focused full-stack developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// A small ASCII terrain, computed in code, so the card echoes the hero canvas
// without shipping an image asset. Deterministic: same rows on every render.
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

export default function OpengraphImage() {
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
          background: '#0b0c0e',
          color: '#e9e6de',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 640 }}>
          <div style={{ color: '#f2a93b', fontSize: 24 }}>lakshyaraj@portfolio:~$ whoami</div>
          <div style={{ fontSize: 66, fontWeight: 700, marginTop: 26, lineHeight: 1.05 }}>Lakshyaraj Singh Rao</div>
          <div style={{ fontSize: 32, marginTop: 28, color: '#d6d2c8', lineHeight: 1.3 }}>
            I build backend systems that fail safely.
          </div>
          <div style={{ fontSize: 23, marginTop: 22, color: '#8f8c83', lineHeight: 1.45 }}>
            Webhooks that never run twice. Retrieval that admits when it has nothing. Streams that stop themselves.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', color: '#f2a93b', fontSize: 15, lineHeight: 1.25, opacity: 0.85 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', whiteSpace: 'pre' }}>{r}</div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
