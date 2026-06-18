'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  '> initializing lakshyaraj.dev...',
  '> loading identity.......... [OK]',
  '> mounting 6 system modules  [██████████] 100%',
  '> fetching live telemetry... [██████░░░░]  60%',
  '> establishing uplink....... [██████████] 100%',
  '> ready.',
];

export function AsciiBoot({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;
    function tick() {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]]);
        i++;
        setTimeout(tick, i === 1 ? 150 : 280);
      } else {
        setTimeout(() => {
          setVisible(false);
          setTimeout(onDone, 400);
        }, 700);
      }
    }
    tick();
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center"
        >
          <div className="font-mono text-sm text-cyan-400 leading-relaxed space-y-0.5">
            {lines.filter(Boolean).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={line?.endsWith('[OK]') ? 'text-green-400' : 'text-cyan-400'}
              >
                {line}
              </motion.div>
            ))}
            {lines.length < BOOT_LINES.length && (
              <span className="inline-block animate-pulse text-cyan-400">▋</span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}