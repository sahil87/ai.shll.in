export interface Tool {
  slug: string;
  label: string;
  blurb: string;
}

export const tools: Tool[] = [
  {
    slug: 'idea',
    label: 'idea',
    blurb:
      'Plain-Markdown backlog (<code>fab/backlog.md</code>) — worktree-aware, queryable from the CLI, feeds <code>/fab-new</code>.',
  },
  {
    slug: 'hop',
    label: 'hop',
    blurb:
      'Fuzzy-nav, batch-git, and run-anything-inside-any-repo from one <code>hop.yaml</code> config.',
  },
  {
    slug: 'fab-kit',
    label: 'fab-kit',
    blurb: '7-stage pipeline that forces AI agents to plan before they code.',
  },
  {
    slug: 'wt',
    label: 'wt',
    blurb:
      'Opinionated <code>git worktree</code> wrapper — one worktree per change, zero conflicts.',
  },
  {
    slug: 'run-kit',
    label: 'run-kit',
    blurb:
      'Browser dashboard for tmux + Claude Code workspaces. Mobile-friendly via Tailscale.',
  },
  {
    slug: 'tu',
    label: 'tu',
    blurb:
      'Token/cost tracker for Claude Code, Codex, OpenCode. Multi-machine sync, live watch.',
  },
  {
    slug: 'shll',
    label: 'shll',
    blurb:
      'Meta-CLI — <code>shll install / update / shell-install</code> to wire and maintain the whole toolkit.',
  },
];
