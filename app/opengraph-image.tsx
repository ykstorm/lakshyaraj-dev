import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Lakshyaraj Singh Rao — Backend & AI-Infrastructure Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Branded phosphor-terminal OG card, generated at the edge (no static asset).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#050706',
          backgroundImage:
            'linear-gradient(rgba(52,211,153,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          color: '#d6e0d8',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ color: '#34d399', fontSize: 26, letterSpacing: 10 }}>
          {'// LAKSHYARAJ SINGH RAO'}
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            marginTop: 28,
            lineHeight: 1.08,
            color: '#ffffff',
            maxWidth: 980,
          }}
        >
          The reliability layer for production AI
        </div>
        <div style={{ fontSize: 32, marginTop: 30, color: '#9aa6a0' }}>
          refusal · guardrails · eval-gating · idempotency
        </div>
        <div style={{ fontSize: 26, marginTop: 48, color: '#22d3ee' }}>
          7 OSS tools · 4 on npm · Backend · AI Infrastructure · DevOps
        </div>
      </div>
    ),
    { ...size },
  );
}
