import { WorldStage } from '@/components/world/world-stage';
import { TerminalHero } from '@/components/ui/terminal-hero';

const ELSEWHERE = [
  { href: 'https://github.com/ykstorm', label: 'GitHub' },
  { href: 'https://linkedin.com/in/lakshyaraj-singh-rao-840273152', label: 'LinkedIn' },
  { href: 'https://www.npmjs.com/~ykstormsorg', label: 'npm' },
  { href: 'mailto:raolakshyaraj@gmail.com', label: 'Email' },
  { href: '/resume', label: 'Resume' },
];

// The headline and the pitch are server-rendered text with no entrance
// animation, so they are the first things painted; the pitch's text box is the
// larger, so it is the LCP element. The world canvas and the terminal hydrate
// after them as client islands.
export function Hero() {
  return (
    <section aria-labelledby="hero-name" className="relative isolate overflow-hidden">
      <WorldStage />
      <div className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-x-12 px-4 pb-10 pt-24 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:pb-14 lg:pt-28">
        <div className="flex min-w-0 flex-col">
          <div className="text-scrim flex flex-col gap-6">
            <h1 id="hero-name" className="font-display text-balance text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.25rem]">
              Lakshyaraj Singh Rao
            </h1>
            <p className="max-w-[36ch] text-[1.2rem] leading-relaxed sm:text-[1.35rem]">
              I build backend systems that fail safely: webhooks that never run twice, retrieval that admits when it has
              nothing, streams that stop themselves.
            </p>
            <p className="mono text-[13px] text-muted-foreground">Building Homesty.ai since November 2025. Mumbai, open to Bangalore.</p>
            <nav aria-label="Elsewhere" className="mono flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
              {ELSEWHERE.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          {/* small screens: the band where the range shows between copy and terminal */}
          <div data-world-anchor aria-hidden className="h-[36svh] min-h-[220px] lg:hidden" />

          <div className="lg:mt-10">
            <TerminalHero />
          </div>
        </div>
      </div>
    </section>
  );
}
