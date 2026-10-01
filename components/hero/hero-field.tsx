'use client';

// Client entry for the hero's "Still Field". It decides whether the field is
// allowed to run — a browser with WebGL and no reduced-motion request — and only
// then loads the engine, which is code-split out of the page via next/dynamic so
// the WebGL never ships to, or renders on, the server. If the person turns on
// reduced motion while the page is open, the gate flips and the engine unmounts,
// which runs its teardown. When the field can't run, this renders nothing and
// the static CSS dot plane behind it is what shows.

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const FieldCanvas = dynamic(() => import('./field-canvas'), { ssr: false, loading: () => null });

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

export function HeroField() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const evaluate = () => setAllowed(!mq.matches && hasWebGL());
    evaluate();
    mq.addEventListener('change', evaluate);
    return () => mq.removeEventListener('change', evaluate);
  }, []);

  if (!allowed) return null;
  return <FieldCanvas />;
}
