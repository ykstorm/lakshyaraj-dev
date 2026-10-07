'use client';

import dynamic from 'next/dynamic';

// The canvas and its engine are a separate chunk, fetched after hydration, so
// the hero's text, which holds the LCP element, paints before any of it loads.
const WorldCanvas = dynamic(() => import('./world-canvas'), { ssr: false, loading: () => null });

export function WorldStage() {
  return <WorldCanvas />;
}
