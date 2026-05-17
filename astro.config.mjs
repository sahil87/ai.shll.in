// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://ai.shll.in',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    starlight({
      title: 'ai.shll.in',
      description:
        'Open-source AI coding toolkit by @sahil87 — small Go CLIs that compose into a complete AI coding workflow.',
      logo: { src: './public/logo.svg', alt: 'ai.shll.in' },
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://ai.shll.in/og-image.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '512' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '512' } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://ai.shll.in/og-image.png' } },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/sahil87' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/32XHh5mJYn' },
        { icon: 'x.com', label: 'X', href: 'https://x.com/_sahilahuja' },
      ],
      sidebar: [
        {
          label: 'Start here',
          items: [{ label: 'Overview', link: '/' }],
        },
        {
          label: 'Tools',
          items: [
            { label: 'All tools', link: '/tools/' },
            { label: 'idea', link: '/tools/idea/' },
            { label: 'hop', link: '/tools/hop/' },
            { label: 'fab-kit', link: '/tools/fab-kit/' },
            { label: 'wt', link: '/tools/wt/' },
            { label: 'run-kit', link: '/tools/run-kit/' },
            { label: 'tu', link: '/tools/tu/' },
            { label: 'shll', link: '/tools/shll/' },
          ],
        },
      ],
      customCss: ['./src/styles/global.css'],
      components: {
        Hero: './src/components/Hero.astro',
      },
    }),
  ],
});
