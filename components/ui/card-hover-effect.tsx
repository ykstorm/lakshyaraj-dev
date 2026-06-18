'use client';

// Aceternity "Card Hover Effect" — adapted from ui.aceternity.com.
// A grid of cards where hovering one slides a tinted highlight behind it
// (AnimatePresence layoutId). Brand-tinted cyan/emerald. Entry stagger fires
// once on first viewport, then the grid is static.
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
        <motion.div
          key={item.id}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative group block h-full w-full"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === i && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-xl bg-emerald-500/10 dark:bg-cyan-500/10"
                layoutId="card-hover-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.1 } }}
              />
            )}
          </AnimatePresence>
          <div className="relative z-10 h-full">{item.content}</div>
        </motion.div>
      ))}
    </div>
  );
}
