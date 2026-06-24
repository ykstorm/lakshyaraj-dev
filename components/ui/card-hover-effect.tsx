'use client';

// Project grid with spring-physics cards. Each card:
//  • staggers in once on first viewport,
//  • tilts in 3D toward the cursor via useSpring (smoothed, max ~7°) and lifts,
//  • slides a brand-tinted highlight behind the hovered one (shared layoutId),
//  • taps down on touch (whileTap) instead of tilting.
// prefers-reduced-motion → no tilt, no entry motion, just the static grid.
import { useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { cn } from '@/lib/utils';

const SPRING = { stiffness: 150, damping: 16, mass: 0.4 };

function TiltCard({
  index,
  hovered,
  setHovered,
  reduce,
  children,
}: {
  index: number;
  hovered: number | null;
  setHovered: (i: number | null) => void;
  reduce: boolean | null;
  children: React.ReactNode;
}) {
  // pointer position within the card, normalised to [-0.5, 0.5]
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), SPRING);
  const lift = useSpring(0, SPRING);
  const liftY = useTransform(lift, [0, 1], [0, -5]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    px.set(0);
    py.set(0);
    lift.set(0);
    setHovered(null);
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => {
        setHovered(index);
        if (!reduce) lift.set(1);
      }}
      onMouseMove={reduce ? undefined : onMove}
      onMouseLeave={reset}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      style={
        reduce
          ? undefined
          : {
              rotateX,
              rotateY,
              y: liftY,
              transformPerspective: 900,
              transformStyle: 'preserve-3d',
            }
      }
      className="relative group block h-full w-full [will-change:transform]"
    >
      <AnimatePresence>
        {hovered === index && (
          <motion.span
            className="pointer-events-none absolute -inset-px block rounded-xl bg-emerald-500/10 dark:bg-cyan-500/10"
            layoutId="card-hover-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.1 } }}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

export function HoverEffect({
  items,
  className,
}: {
  items: { id: string; content: React.ReactNode }[];
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-5', className)}>
      {items.map((item, i) => (
        <TiltCard key={item.id} index={i} hovered={hovered} setHovered={setHovered} reduce={reduce}>
          {item.content}
        </TiltCard>
      ))}
    </div>
  );
}
