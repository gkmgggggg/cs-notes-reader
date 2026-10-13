import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { unified } from '@astrojs/markdown-remark';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const schema = {
  ...defaultSchema,
  clobberPrefix: '',
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div ?? []), 'align'],
    img: [...(defaultSchema.attributes?.img ?? []), 'width', 'height', 'loading', 'decoding', ['className', 'mathjax-pic']]
  }
};

export default defineConfig({
  output: 'static',
  base: '/cs-notes/',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [react()],
  markdown: {
    processor: unified({
      smartypants: false,
      rehypePlugins: [rehypeRaw, [rehypeSanitize, schema]],
      shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, wrap: false }
    })
  }
});
