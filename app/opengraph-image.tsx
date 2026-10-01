import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Lakshyaraj Singh Rao — full-stack developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Plain editorial OG card, generated at the edge (no static asset).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '215px 96px',
          background: '#f5f3ee',
          color: '#16171a',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            color: '#16171a',
          }}
        >
          Lakshyaraj Singh Rao
        </div>
        <div style={{ fontSize: 36, marginTop: 28, color: '#3b382f' }}>
          Full-stack developer, backend focus
        </div>
        <div style={{ fontSize: 28, marginTop: 44, color: '#1e6b5c' }}>
          Building Homesty.ai · Mumbai / Bangalore
        </div>
      </div>
    ),
    { ...size },
  );
}
