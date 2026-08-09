// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // The prototype domain. This becomes 'https://fotvg.org' at switchover, and
  // it is the single most important thing to change then: canonical URLs, the
  // sitemap, and Open Graph URLs all derive from it. See decision 015.
  site: 'https://fotvg-webtest.netlify.app',

  // One URL shape, chosen once. '/get-involved', never '/get-involved/'.
  // 'file' emits get-involved.html rather than get-involved/index.html, which
  // Netlify serves at the no-slash URL without a redirect hop.
  trailingSlash: 'never',
  build: { format: 'file' },

  integrations: [sitemap()]
});
