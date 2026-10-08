import type { Metadata } from 'next';
import { Subpage } from '@/components/subpage';
import { HOME_CARD, share } from '@/lib/share';

const DESCRIPTION = 'Resume of Lakshyaraj Singh Rao, full-stack developer with a backend focus.';

export const metadata: Metadata = {
  title: 'Resume',
  description: DESCRIPTION,
  alternates: { canonical: '/resume' },
  ...share({ title: 'Resume', description: DESCRIPTION, path: '/resume', image: HOME_CARD }),
};

const PDF = '/Lakshyaraj_Singh_Rao_Resume.pdf';

export default function ResumePage() {
  return (
    <Subpage
      crumbs={[{ label: 'resume' }]}
      actions={
        <>
          <a href={PDF} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-strong">Open PDF</a>
          <a href={PDF} download className="text-muted-foreground hover:text-accent">Download</a>
        </>
      }
    >
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Resume</h1>
      <p className="mt-3 text-muted-foreground">One page. The PDF is the source of truth for everything on this site.</p>

      {/* Mobile browsers often cannot embed a PDF; the Open PDF link above and
          the one below cover them, so the resume is never a dead end. */}
      <iframe
        src={`${PDF}#view=FitH`}
        title="Lakshyaraj Singh Rao, resume"
        className="mt-8 w-full rounded-md border border-border bg-card"
        style={{ height: '80vh' }}
      />
      <p className="mono mt-3 text-xs text-muted-foreground">
        PDF not showing?{' '}
        <a href={PDF} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
          Open it in a new tab
        </a>
        .
      </p>
    </Subpage>
  );
}
