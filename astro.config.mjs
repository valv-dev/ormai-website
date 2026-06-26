// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Production domain (used for canonical + Open Graph URLs).
  site: "https://valv.sh",

  integrations: [react(), mdx(), sitemap()],

  markdown: {
    shikiConfig: { theme: "tokyo-night" },
  },

  vite: {
    plugins: [tailwindcss()]
  }
});