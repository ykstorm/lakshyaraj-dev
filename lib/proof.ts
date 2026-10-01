// Proof data, fetched on the server at build and cached for an hour. Every
// number on the proof section comes from here — the npm registry for published
// versions, the GitHub Actions API for CI state — so the page can only show what
// the registries actually returned. A failed fetch yields null, never a stand-in
// number: the UI then links out instead of printing a figure.

const NPM_ORG = '@ykstormsorg';
const NPM_PKGS = ['anvil', 'tripwire', 'goldset', 'quickdraw'] as const;
const GH_USER = 'ykstorm';
const REPOS = ['anvil', 'tripwire', 'anchor', 'stackup', 'goldset', 'quickdraw', 'codecraft-ai'] as const;

const REVALIDATE = 3600;

export interface NpmVersion {
  pkg: string; // short name, e.g. "anvil"
  full: string; // "@ykstormsorg/anvil"
  version: string | null; // null when the registry fetch failed
  url: string;
}

export interface CiStatus {
  repo: string;
  state: 'passing' | 'failing' | 'unknown'; // unknown = no run found or fetch failed
  daysAgo: number | null;
  actionsUrl: string;
}

export interface Proof {
  npm: NpmVersion[];
  ci: CiStatus[];
}

async function fetchNpm(pkg: string): Promise<NpmVersion> {
  const full = `${NPM_ORG}/${pkg}`;
  const url = `https://www.npmjs.com/package/${full}`;
  try {
    const res = await fetch(`https://registry.npmjs.org/${full}/latest`, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return { pkg, full, version: null, url };
    const data = await res.json();
    return { pkg, full, version: typeof data.version === 'string' ? data.version : null, url };
  } catch {
    return { pkg, full, version: null, url };
  }
}

function daysSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

async function fetchCi(repo: string): Promise<CiStatus> {
  const actionsUrl = `https://github.com/${GH_USER}/${repo}/actions`;
  const api = `https://api.github.com/repos/${GH_USER}/${repo}/actions/workflows/ci.yml/runs?branch=main&per_page=1`;
  try {
    const res = await fetch(api, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return { repo, state: 'unknown', daysAgo: null, actionsUrl };
    const data = await res.json();
    const run = Array.isArray(data.workflow_runs) ? data.workflow_runs[0] : undefined;
    if (!run) return { repo, state: 'unknown', daysAgo: null, actionsUrl };
    const when = run.updated_at || run.run_started_at || run.created_at;
    const state = run.conclusion === 'success' ? 'passing' : 'failing';
    return { repo, state, daysAgo: when ? daysSince(when) : null, actionsUrl };
  } catch {
    return { repo, state: 'unknown', daysAgo: null, actionsUrl };
  }
}

export async function getProof(): Promise<Proof> {
  const [npm, ci] = await Promise.all([
    Promise.all(NPM_PKGS.map(fetchNpm)),
    Promise.all(REPOS.map(fetchCi)),
  ]);
  return { npm, ci };
}
