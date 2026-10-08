// Live proof for the home page, fetched on the server at build time and
// refreshed at most once an hour (ISR). Nothing here is hard-coded: versions,
// downloads, check results, stars and commit counts all come from npm and
// GitHub. When a fetch fails, the result carries the exact URL that failed so
// the page can print it instead of quietly showing a stale or invented number.
import projectsData from '@/data/projects.json';

const OWNER = 'ykstorm';
const REVALIDATE = 3600;

type Project = { id: string; name: string; code?: string; npm?: string };
const PROJECTS = projectsData as Project[];

export type Failure = { ok: false; url: string; reason: string };

// GitHub allows 60 unauthenticated requests an hour per IP. An optional
// GITHUB_TOKEN (read-only, public repos) lifts that to 5,000; without one the
// page still builds and any rate-limited request shows up as a printed failure.
//
// Requests per build without a token: two per project repository (check runs,
// stars), one to list my repositories, and one to three per public repository
// for the commit calendar (GitHub answers 202 while it computes the stats).
function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'lakshyaraj-dev-portfolio',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function reasonOf(err: unknown): string {
  return err instanceof Error ? err.message : 'network error';
}

// GitHub signals a spent rate limit with a 403 or 429 and zero requests left.
// Say that, and when the window resets, rather than a bare status code.
function httpError(res: Response): Error {
  const limited = (res.status === 403 || res.status === 429) && res.headers.get('x-ratelimit-remaining') === '0';
  if (!limited) return new Error(`HTTP ${res.status}`);
  const reset = Number(res.headers.get('x-ratelimit-reset'));
  const at = reset > 0 ? `, resets at ${new Date(reset * 1000).toISOString().slice(11, 16)} UTC` : '';
  return new Error(`HTTP ${res.status}, rate limit reached${at}`);
}

async function getJson(url: string, github: boolean): Promise<{ status: number; body: unknown }> {
  const res = await fetch(url, {
    headers: github ? githubHeaders() : undefined,
    next: { revalidate: REVALIDATE },
  });
  if (res.status === 202 || res.status === 204) return { status: res.status, body: null };
  if (!res.ok) throw httpError(res);
  return { status: res.status, body: await res.json() };
}

const npmPackages = () => PROJECTS.flatMap((p) => (p.npm ? [p.npm] : []));

function projectRepos(): { id: string; repo: string; name: string }[] {
  return PROJECTS.flatMap((p) => {
    const m = p.code?.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)$/);
    return m && m[1] === OWNER ? [{ id: p.id, repo: m[2], name: p.name }] : [];
  });
}

// ── npm ──────────────────────────────────────────────────────────────────────
export type NpmResult = { name: string; page: string } & ({ ok: true; version: string } | Failure);

async function getNpmVersions(): Promise<NpmResult[]> {
  return Promise.all(
    npmPackages().map(async (name): Promise<NpmResult> => {
      const page = `https://www.npmjs.com/package/${name}`;
      const url = `https://registry.npmjs.org/${name}/latest`;
      try {
        const { body } = await getJson(url, false);
        const version = (body as { version?: unknown } | null)?.version;
        if (typeof version !== 'string') return { name, page, ok: false, url, reason: 'no version in response' };
        return { name, page, ok: true, version };
      } catch (err) {
        return { name, page, ok: false, url, reason: reasonOf(err) };
      }
    }),
  );
}

// ── npm: downloads in the last week ──────────────────────────────────────────
export type DownloadsResult = { name: string } & ({ ok: true; downloads: number } | Failure);

async function getNpmDownloads(): Promise<DownloadsResult[]> {
  return Promise.all(
    npmPackages().map(async (name): Promise<DownloadsResult> => {
      const url = `https://api.npmjs.org/downloads/point/last-week/${name}`;
      try {
        const { body } = await getJson(url, false);
        const downloads = (body as { downloads?: unknown } | null)?.downloads;
        if (typeof downloads !== 'number') return { name, ok: false, url, reason: 'no download count in response' };
        return { name, ok: true, downloads };
      } catch (err) {
        return { name, ok: false, url, reason: reasonOf(err) };
      }
    }),
  );
}

// ── CI: check runs on the latest commit to main ──────────────────────────────
export type CiState = 'passing' | 'failing' | 'running' | 'no checks';
export type CiResult = { repo: string; name: string; page: string } & (
  | { ok: true; state: CiState; total: number; failed: number; sha: string | null }
  | Failure
);

type CheckRun = { status: string; conclusion: string | null; head_sha?: string };
const FAILED = new Set(['failure', 'timed_out', 'cancelled', 'action_required', 'startup_failure', 'stale']);

function summarise(runs: CheckRun[]): { state: CiState; failed: number } {
  if (runs.length === 0) return { state: 'no checks', failed: 0 };
  const failed = runs.filter((r) => r.conclusion && FAILED.has(r.conclusion)).length;
  if (failed > 0) return { state: 'failing', failed };
  if (runs.some((r) => r.status !== 'completed')) return { state: 'running', failed: 0 };
  return { state: 'passing', failed: 0 };
}

async function getCiStatuses(): Promise<CiResult[]> {
  return Promise.all(
    projectRepos().map(async ({ repo, name }): Promise<CiResult> => {
      const url = `https://api.github.com/repos/${OWNER}/${repo}/commits/main/check-runs?per_page=100`;
      const fallbackPage = `https://github.com/${OWNER}/${repo}/actions`;
      try {
        const { body } = await getJson(url, true);
        const runs = ((body as { check_runs?: CheckRun[] } | null)?.check_runs ?? []) as CheckRun[];
        const { state, failed } = summarise(runs);
        const sha = runs[0]?.head_sha ?? null;
        const page = sha ? `https://github.com/${OWNER}/${repo}/commit/${sha}` : fallbackPage;
        return { repo, name, page, ok: true, state, total: runs.length, failed, sha };
      } catch (err) {
        return { repo, name, page: fallbackPage, ok: false, url, reason: reasonOf(err) };
      }
    }),
  );
}

// ── GitHub: stars and forks of each project repository ───────────────────────
export type StarsResult = { id: string; repo: string } & ({ ok: true; stars: number; forks: number } | Failure);

async function getStars(): Promise<StarsResult[]> {
  return Promise.all(
    projectRepos().map(async ({ id, repo }): Promise<StarsResult> => {
      const url = `https://api.github.com/repos/${OWNER}/${repo}`;
      try {
        const { body } = await getJson(url, true);
        const counts = (body ?? {}) as { stargazers_count?: unknown; forks_count?: unknown };
        const [stars, forks] = [counts.stargazers_count, counts.forks_count];
        if (typeof stars !== 'number' || typeof forks !== 'number') return { id, repo, ok: false, url, reason: 'no star count in response' };
        return { id, repo, ok: true, stars, forks };
      } catch (err) {
        return { id, repo, ok: false, url, reason: reasonOf(err) };
      }
    }),
  );
}

// ── Commit calendar: commits to my own public repositories ───────────────────
// GitHub's profile graph also counts pull requests and issues on other people's
// repos. This sums each owned repo's weekly commit activity instead, so the
// graph measures exactly what its caption says.
export type CalendarWeek = { start: number; days: number[] };
export type Calendar = { ok: true; weeks: CalendarWeek[]; total: number; repos: number; missing: Failure[] } | Failure;

type RepoMeta = { name: string; fork: boolean; archived: boolean; private: boolean };
type ActivityWeek = { week: number; days: number[] };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// The stats endpoint answers 202 while GitHub computes it. Next's data cache
// stores only 200 responses, so a 202 is never cached, but within one render
// Next also reuses the response of an identical request; each retry uses a
// distinct query string so it really asks GitHub again.
async function commitActivity(repo: string): Promise<ActivityWeek[] | Failure> {
  const base = `https://api.github.com/repos/${OWNER}/${repo}/stats/commit_activity`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const url = attempt === 1 ? base : `${base}?attempt=${attempt}`;
    try {
      const { status, body } = await getJson(url, true);
      if (status === 200 && Array.isArray(body)) return body as ActivityWeek[];
      if (attempt < 3) await sleep(1500);
    } catch (err) {
      return { ok: false, url, reason: reasonOf(err) };
    }
  }
  return { ok: false, url: base, reason: 'GitHub was still computing this repo’s stats' };
}

async function getCommitCalendar(): Promise<Calendar> {
  const listUrl = `https://api.github.com/users/${OWNER}/repos?type=owner&per_page=100`;
  let repos: RepoMeta[];
  try {
    const { body } = await getJson(listUrl, true);
    repos = ((body as RepoMeta[] | null) ?? []).filter((r) => !r.fork && !r.archived && !r.private);
  } catch (err) {
    return { ok: false, url: listUrl, reason: reasonOf(err) };
  }

  const results = await Promise.all(repos.map((r) => commitActivity(r.name)));
  const byWeek = new Map<number, number[]>();
  const missing: Failure[] = [];
  let counted = 0;

  for (const result of results) {
    if (!Array.isArray(result)) {
      missing.push(result);
      continue;
    }
    counted++;
    for (const w of result) {
      const days = byWeek.get(w.week) ?? [0, 0, 0, 0, 0, 0, 0];
      w.days.forEach((n, i) => (days[i] += n));
      byWeek.set(w.week, days);
    }
  }

  if (counted === 0) {
    const first = missing[0];
    return first ?? { ok: false, url: listUrl, reason: 'no public repositories found' };
  }

  const weeks = [...byWeek.entries()]
    .sort((a, b) => a[0] - b[0])
    .slice(-52)
    .map(([start, days]) => ({ start, days }));
  const total = weeks.reduce((sum, w) => sum + w.days.reduce((s, n) => s + n, 0), 0);
  return { ok: true, weeks, total, repos: counted, missing };
}

export type Proof = {
  npm: NpmResult[];
  downloads: DownloadsResult[];
  ci: CiResult[];
  stars: StarsResult[];
  calendar: Calendar;
  fetchedAt: number;
};

export async function getProof(): Promise<Proof> {
  const [npm, downloads, ci, stars, calendar] = await Promise.all([
    getNpmVersions(),
    getNpmDownloads(),
    getCiStatuses(),
    getStars(),
    getCommitCalendar(),
  ]);
  return { npm, downloads, ci, stars, calendar, fetchedAt: Date.now() };
}
