// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://ai.shll.in',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()]
});