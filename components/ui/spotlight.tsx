'use client';

// Aceternity "Spotlight" — adapted from ui.aceternity.com.
// A large blurred conic/radial highlight that fades in over a section. Tinted
// emerald-green (brand) instead of the default blue-purple. Purely decorative.
import { cn } from '@/lib/utils';

export function Spotlight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute -top-40 left-0 z-0 h-[160%] w-full opacity-0 animate-[spotlight_2s_ease_0.5s_1_forwards] motion-reduce:opacity-100 motion-reduce:animate-none',
        className,
      )}
      viewBox="0 0 3787 2842"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#spotlight-filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill="url(#spotlight-grad)"
          fillOpacity="0.18"
        />
      </g>
      <defs>
        <filter
          id="spotlight-filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" />
        </filter>
        <linearGradient id="spotlight-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </svg>
  );
}
