// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://ai.shll.in',
  server: { host: '0.0.0.0' },
  vite: {
    server: {
      // Allow rk-proxy + Tailscale hostnames. `true` skips the host check entirely;
      // safe here because the dev server is for an experiment under _playground.
      allowedHosts: true,
    },
  },
  integrations: [
    starlight({
      title: 'shll',
      description: 'The shll AI coding toolkit — 7 CLIs that play well together.',
      customCss: ['./src/styles/terminal.css'],
      logo: { src: './src/assets/prompt.svg', replacesTitle: false },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/sahil87' },
      ],
      pagination: true,
      lastUpdated: false,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        {
          label: 'Getting started',
          items: [
            { label: 'Overview', slug: 'getting-started/overview' },
            { label: 'Install everything', slug: 'getting-started/install' },
            { label: 'Philosophy', slug: 'getting-started/philosophy' },
          ],
        },
        {
          label: 'Tools',
          items: [
            {
              label: 'idea',
              collapsed: true,
              items: [
                { label: 'Overview', slug: 'tools/idea/overview' },
                { label: 'Install', slug: 'tools/idea/install' },
                { label: 'Commands', slug: 'tools/idea/commands' },
                { label: 'Workflows', slug: 'tools/idea/workflows' },
              ],
            },
            {
              label: 'hop',
              collapsed: true,
              items: [{ label: 'Overview', slug: 'tools/hop/overview' }],
            },
            {
              label: 'fab-kit',
              collapsed: true,
              items: [
                { label: 'Overview', slug: 'tools/fab-kit/overview' },
                { label: 'Install', slug: 'tools/fab-kit/install' },
                { label: 'Commands', slug: 'tools/fab-kit/commands' },
                { label: 'Workflows', slug: 'tools/fab-kit/workflows' },
              ],
            },
            {
              label: 'wt',
              collapsed: true,
              items: [{ label: 'Overview', slug: 'tools/wt/overview' }],
            },
            {
              label: 'run-kit',
              collapsed: true,
              items: [{ label: 'Overview', slug: 'tools/run-kit/overview' }],
            },
            {
              label: 'tu',
              collapsed: true,
              items: [{ label: 'Overview', slug: 'tools/tu/overview' }],
            },
            {
              label: 'shll',
              collapsed: true,
              items: [{ label: 'Overview', slug: 'tools/shll/overview' }],
            },
          ],
        },
        {
          label: 'Workflows',
          items: [
            { label: 'Daily flow', slug: 'workflows/daily-flow' },
            { label: 'Start a new change', slug: 'workflows/new-change' },
          ],
        },
      ],
    }),
    mdx(),
  ],
});
