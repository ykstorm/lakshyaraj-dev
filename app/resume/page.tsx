import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume — Lakshyaraj Singh Rao',
  description: 'Resume of Lakshyaraj Singh Rao — Backend Engineer · AI Infrastructure.',
};

const PDF = '/Lakshyaraj_Singh_Rao_Resume.pdf';

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-zinc-800 dark:text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/"
            className="text-[12px] font-mono text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors tracking-wide"
          >
            ← back
          </Link>
          <a
            href={PDF}
            download
            className="inline-flex items-center gap-2 px-4 py-2 border border-cyan-500/50 rounded-lg font-mono text-xs text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
          >
            Download PDF
          </a>
        </div>

        <div className="mb-6">
          <span className="section-label">// Resume</span>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Lakshyaraj Singh Rao
          </h1>
        </div>

        <object
          data={PDF}
          type="application/pdf"
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800"
          style={{ height: '80vh' }}
        >
          <noscript>
            <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
              Your browser can&apos;t display the embedded PDF.{' '}
              <a href={PDF} className="text-cyan-700 dark:text-cyan-400 underline">
                Download the resume
              </a>
              .
            </p>
          </noscript>
          <p className="p-4 font-mono text-sm text-zinc-600 dark:text-zinc-400">
            Can&apos;t display the PDF inline.{' '}
            <a href={PDF} download className="text-cyan-700 dark:text-cyan-400 underline">
              Download it instead
            </a>
            .
          </p>
        </object>
      </div>
    </div>
  );
}
