'use client';
import { useEffect, useRef } from 'react';

export function BinaryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const cols = Math.floor(window.innerWidth / 18) + 1;
    const drops: number[] = new Array(cols).fill(1);

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const c = canvas;
    function draw() {
      if (!c || !ctx) return;
      ctx!.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx!.fillRect(0, 0, c.width, c.height);
      ctx!.fillStyle = '#22d3ee';
      ctx!.font = '14px JetBrains Mono, monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = Math.random() > 0.5 ? '1' : '0';
        ctx!.fillText(char, i * 18, drops[i] * 18);
        if (drops[i] * 18 > c.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-[0.07]"
      aria-hidden="true"
    />
  );
}