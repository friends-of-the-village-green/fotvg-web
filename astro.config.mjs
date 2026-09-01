// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // The real address. Canonical URLs, the sitemap and every Open Graph tag
  // derive from this, so it must match what visitors actually type — the apex,
  // with www.fotvg.org redirecting to it. See docs/dns-cutover.md.
  //
  // Until August 2026 this read 'https://fotvg-webtest.netlify.app', the
  // prototype on John's personal Netlify account (decision 015). The prototype
  // still exists and still builds from this branch, so it now serves pages whose
  // canonical tags point here, at fotvg.org. That is the intended behavior: it
  // tells search engines which of the two addresses is the real site.
  site: 'https://fotvg.org',

  // One URL shape, chosen once. '/get-involved', never '/get-involved/'.
  // 'file' emits get-involved.html rather than get-involved/index.html, which
  // Netlify serves at the no-slash URL without a redirect hop.
  trailingSlash: 'never',
  build: { format: 'file' },

  integrations: [sitemap()]
});
