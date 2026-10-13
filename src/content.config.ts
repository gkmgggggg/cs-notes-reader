import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { noteMetadata } from './lib/schema';

const notes = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/notes' }), schema: noteMetadata });
export const collections = { notes };
