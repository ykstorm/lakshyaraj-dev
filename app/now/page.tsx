import Link from 'next/link';
import type { Metadata } from 'next';
import nowData from '@/data/now.json';

export const metadata: Metadata = {
  title: 'Now — Lakshyaraj Singh Rao',
  description: 'What I am working on right now.',
};

export default function NowPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Link
          href="/"
          className="text-[12px] font-mono text-zinc-500 hover:text-cyan-400 transition-colors tracking-wide"
        >
          ← back
        </Link>

        <div className="mt-8 mb-10">
          <span className="section-label">// Now</span>
          <h1 className="mt-3 text-3xl font-bold text-white tracking-tight">What I'm doing now</h1>
          <p className="mt-2 text-[13px] text-zinc-500 font-mono">
            A snapshot, not a feed. Updated when the work changes.
          </p>
        </div>

        <div className="space-y-6">
          <section className="telemetry-card space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="section-label text-[10px]">Current focus</span>
            </div>
            <p className="font-mono text-sm text-zinc-200 leading-relaxed">{nowData.current}</p>
          </section>

          <section className="telemetry-card space-y-3">
            <span className="section-label text-[10px]">Just shipped</span>
            <ul className="space-y-2">
              {nowData.shipped.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px] text-zinc-400">
                  <span className="text-cyan-400 mt-0.5">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="telemetry-card space-y-3">
            <span className="section-label text-[10px]">Up next</span>
            <p className="font-mono text-sm text-zinc-300 leading-relaxed">{nowData.next}</p>
          </section>

          <section className="telemetry-card space-y-3">
            <span className="section-label text-[10px]">Open to</span>
            <ul className="space-y-2">
              {nowData.open_to.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px] text-zinc-400">
                  <span className="text-green-400 mt-0.5">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <p className="font-mono text-[11px] text-zinc-600 pt-2">
            Last updated {nowData.updated_at}
          </p>
        </div>
      </div>
    </div>
  );
}
