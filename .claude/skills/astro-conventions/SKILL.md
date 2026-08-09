---
name: astro-conventions
description: Code structure, styling, performance, and component conventions for the FotVG Astro site. Use this skill whenever creating or modifying anything under src/ — pages, layouts, components, styles, or config. Also use it when adding a dependency, setting up routing, handling images, or making decisions about client-side JavaScript. If the task involves writing frontend code for this project, read this first.
---

# FotVG Astro Conventions

## Philosophy

This is a small brochure site for a volunteer organization. It should load fast on a
weak rural cell connection, work with JavaScript disabled, and be readable by a
maintainer who has never seen Astro before.

Default to **less**: less JavaScript, fewer dependencies, fewer abstractions. A bit of
repetition is cheaper than a clever abstraction nobody can follow.

## Structure

```
src/
├── pages/           # File-based routes. One file per URL.
├── layouts/         # BaseLayout.astro and a small number of variants
├── components/      # Presentational pieces. Keep them dumb.
├── lib/
│   ├── sanity.js    # client setup + urlFor
│   ├── queries.js   # all GROQ, named exports
│   └── dates.js     # timezone-aware formatting helpers
├── styles/
│   └── global.css   # design tokens + base styles
└── content/         # markdown for rarely-changing prose pages
```

Pages fetch data and pass it down. Components receive props and render. Components do
not fetch.

## JavaScript

Ship as close to zero client-side JavaScript as possible. Astro renders static HTML by
default — keep it that way.

Before adding a `client:*` directive, ask whether the feature can work without it. A
mobile nav toggle can be done with a details/summary element or ~10 lines of vanilla JS
in a script tag. It does not need a framework component.

Do **not** add React, Vue, or Svelte to this project. If you find yourself wanting them,
the feature is probably too complex for this site's constraints — raise it instead.

## Styling

Plain CSS with custom properties. No Tailwind, no CSS-in-JS, no preprocessor.

Rationale: a future maintainer can open a `.css` file and understand it. A Tailwind
config plus a build step plus utility class soup is a wall for someone who last touched
HTML in 2015. This is written in `docs/decisions.md`; don't reverse it silently.

Define tokens once in `global.css`:

```css
:root {
  --color-text: #1f2418;
  --color-bg: #fdfdfb;
  --color-accent: #3d6b35;
  --color-accent-dark: #2b4d25;   /* for text on light backgrounds — check contrast */
  --font-body: system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-display: Georgia, 'Times New Roman', serif;
  --measure: 68ch;
  --space-s: 0.5rem;
  --space-m: 1rem;
  --space-l: 2rem;
  --space-xl: 4rem;
}
```

Use system fonts, or at most one self-hosted webfont subset. Do not load Google Fonts
from Google's CDN — it's a third-party request, a privacy consideration, and a render
blocker for marginal benefit.

Body text: minimum 18px, line-height 1.6, max width around 68 characters. This audience
skews older; err generous.

Mobile first. Write the small-screen styles, then add `min-width` media queries.

## Images

All content images come from Sanity through `urlFor` — see the `sanity-content-model`
skill. For the handful of static assets (logo, favicon, og-image default), put them in
`src/assets/` and use Astro's `<Image />` component so they get optimized.

Always set `width`, `height`, and `loading="lazy"` (except the hero image, which should
be `loading="eager"` and `fetchpriority="high"`).

## Routing and URLs

- Lowercase, hyphenated slugs: `/get-involved`, `/events/secret-garden-tour-2026`
- No trailing-slash inconsistency — pick one in `astro.config.mjs` and stick to it
- Event detail pages: `/events/[slug]`
- Past events remain accessible at their URL forever. Never delete a page that has been
  public; if content is retired, leave the page and mark it past. Broken links from
  Facebook posts and printed flyers are a real cost for a community organization.

## Every page needs

- A unique `<title>` and meta description
- Open Graph tags (title, description, image, url) — most of this site's traffic will
  arrive from links shared on Facebook and Nextdoor, so the link preview matters
- Canonical URL
- A single `<h1>`
- Skip-to-content link as the first focusable element

Put all of this in `BaseLayout.astro` so it cannot be forgotten.

## Also required at the site level

- `sitemap.xml` (via `@astrojs/sitemap`)
- `robots.txt`
- A real 404 page with navigation back into the site
- `favicon.ico` plus an apple-touch-icon

## Dates

Never format a date with the default locale. The build runs in UTC and will show the
wrong day for evening events. Always use the helpers in `src/lib/dates.js`, which pin
formatting to `America/Los_Angeles`.

```js
export function formatEventDate(iso) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'long', month: 'long', day: 'numeric',
  }).format(new Date(iso))
}
```

## Forms

Netlify Forms, with:
- `data-netlify="true"` and a `netlify-honeypot` field
- A real `<label>` for every input, visibly associated — not placeholder-as-label
- A visible required-field indicator
- A success page or inline confirmation that is announced to screen readers
- Spam filtering enabled in the Netlify UI

Do not build a custom form handler. Do not collect anything you don't need — no phone
numbers, no addresses, no birthdates.

## Dependencies

Ask before adding one. When you do add one, note in `docs/decisions.md` what it does
and what would replace it if it were abandoned.

Reasonable to add: `@sanity/client`, `@sanity/image-url`, `astro-portabletext`,
`@astrojs/sitemap`, `pagefind`.

Not reasonable without discussion: any UI framework, any CSS framework, any state
manager, any animation library, anything with more than a handful of transitive deps.

## Performance targets

These are checkable, so check them before merging anything significant:

- Lighthouse performance ≥ 95 on mobile
- Largest Contentful Paint under 2.0s on simulated 4G
- Total page weight under 500KB for a typical content page
- Zero cumulative layout shift

Bandwidth is metered on the hosting plan. Page weight is a cost, not just a nicety.
