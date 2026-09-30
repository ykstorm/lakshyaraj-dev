import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume — Lakshyaraj Singh Rao',
  description: 'Resume of Lakshyaraj Singh Rao — full-stack developer, backend focus.',
  alternates: { canonical: '/resume' },
  openGraph: { title: 'Resume — Lakshyaraj Singh Rao', description: 'Resume of Lakshyaraj Singh Rao — full-stack developer, backend focus.', url: '/resume' },
};

const PDF = '/Lakshyaraj_Singh_Rao_Resume.pdf';

export default function ResumePage() {
  return (
    <div className="col py-12">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h1 className="text-[clamp(1.8rem,5vw,2.4rem)] font-bold tracking-tight">Resume</h1>
        <div className="flex items-center gap-4 mono text-[0.85rem]">
          <a href={PDF} target="_blank" rel="noopener noreferrer" className="link">Open PDF</a>
          <a href={PDF} download className="link">Download</a>
        </div>
      </div>

      {/* iframe renders PDFs inline more reliably than <object> on desktop.
          Mobile browsers often can't embed a PDF at all — the always-visible
          "Open PDF" link above covers them, so the resume is never a dead end. */}
      <iframe
        src={`${PDF}#view=FitH`}
        title="Lakshyaraj Singh Rao — resume"
        className="mt-6 w-full rounded-lg border border-[var(--border)] bg-[var(--card)]"
        style={{ height: '80vh' }}
      />
      <p className="mt-3 mono text-[0.8rem] text-[var(--muted-foreground)]">
        PDF not showing?{' '}
        <a href={PDF} target="_blank" rel="noopener noreferrer" className="link">Open it in a new tab</a>.
      </p>
    </div>
  );
}
