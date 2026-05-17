import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    name: z.string(),
    oneLiner: z.string(),
    githubUrl: z.string().url(),
    brewFormula: z.string(),
    order: z.number(),
  }),
});

export const collections = { tools };
