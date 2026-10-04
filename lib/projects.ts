import projectsData from '@/data/projects.json';

export interface Project {
  id: string;
  name: string;
  /** One line: what it does, from the user's side. */
  tagline: string;
  /** The short storyline: the problem, then what it does about it. */
  description: string;
  stack: string[];
  demo?: string;
  playground?: string;
  code?: string;
  npm?: string;
  flagship?: boolean;
}

export const PROJECTS = projectsData as Project[];

type ProjectLink = { kind: 'live' | 'playground' | 'code' | 'npm'; label: string; href: string };

export function projectLinks(p: Project): ProjectLink[] {
  const links: ProjectLink[] = [];
  if (p.demo) links.push({ kind: 'live', label: 'Live', href: p.demo });
  if (p.playground && p.playground !== p.demo) links.push({ kind: 'playground', label: 'Playground', href: p.playground });
  if (p.code) links.push({ kind: 'code', label: 'Code', href: p.code });
  if (p.npm) links.push({ kind: 'npm', label: 'npm', href: `https://www.npmjs.com/package/${p.npm}` });
  return links;
}
