'use client';

// Aceternity "Background Beams" — adapted from ui.aceternity.com.
// Tinted to the console-green brand (cyan/emerald), kept subtle. Animated SVG
// gradient beams that drift along curved paths. Static (no animation) under
// prefers-reduced-motion.
import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function BackgroundBeams({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, '');

  const paths = [
    'M-100 200 C 200 100, 400 300, 700 180',
    'M-120 320 C 180 220, 420 420, 720 300',
    'M-90 440 C 220 360, 380 540, 700 420',
    'M-110 560 C 160 480, 440 660, 720 540',
    'M-100 80 C 240 20, 360 200, 700 60',
  ];

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full overflow-hidden',
        className,
      )}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 700 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id={`beam-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => (
          <g key={i}>
            <path d={d} stroke="currentColor" strokeOpacity={0.05} strokeWidth={1} />
            {!reduce && (
              <motion.path
                d={d}
                stroke={`url(#beam-${id})`}
                strokeWidth={1.5}
                strokeLinecap="round"
                initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
                animate={{ pathLength: 0.35, pathOffset: [0, 1], opacity: [0, 1, 0] }}
                transition={{
                  duration: 7 + i * 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 1.2,
                }}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
