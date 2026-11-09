import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://tanvirahmedaadeef.com',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'never' },
  vite: { build: { chunkSizeWarningLimit: 700 } },
});
