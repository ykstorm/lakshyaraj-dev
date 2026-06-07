'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ResumeButtonProps {
  href: string;
}

const GLITCH_CHARS = '█▓▒░▄▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀';

export function ResumeButton({ href }: ResumeButtonProps) {
  const [glitched, setGlitched] = useState(false);
  const [displayed, setDisplayed] = useState('DECRYPT TO READ');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startGlitch() {
    setGlitched(true);
    let count = 0;
    intervalRef.current = setInterval(() => {
      const label = 'DECRYPT TO READ';
      if (count < label.length) {
        setDisplayed(label.slice(0, count) + GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)].repeat(label.length - count));
        count++;
      } else {
        setDisplayed('DECRYPT TO READ');
        setGlitched(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 60);
  }

  function stopGlitch() {
    setGlitched(false);
    setDisplayed('DECRYPT TO READ');
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener"
      onMouseEnter={startGlitch}
      onMouseLeave={stopGlitch}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-flex items-center gap-2 px-5 py-2.5 border border-cyan-500/50 rounded-lg font-mono text-xs text-cyan-400 hover:bg-cyan-500/10 transition-all duration-150 cursor-pointer"
    >
      {glitched && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.1, repeat: Infinity }}
          className="text-cyan-300"
        >▋</motion.span>
      )}
      {displayed}
    </motion.a>
  );
}