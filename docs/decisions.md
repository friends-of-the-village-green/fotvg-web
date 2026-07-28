# Decision log

Short entries. What was decided, why, and what would make us revisit it.
Append new entries at the bottom. Do not rewrite history — supersede instead.

---

## 001 — Static site (Astro) rather than WordPress
**Date:** 2026-07
**Decision:** Build a static site with Astro, hosted on Netlify.
**Why:** No ongoing security patching, no plugin update treadmill, near-zero hosting
cost, fast on rural connections. FOTVG has one technical volunteer; a WordPress install
is a recurring maintenance obligation that a static site does not have.
**Tradeoff:** No plugin ecosystem. Anything dynamic has to be deliberately built or
delegated to a third-party embed.
**Revisit if:** the site needs member accounts, gated content, or e-commerce.

## 002 — Sanity as the CMS
**Date:** 2026-07
**Decision:** Sanity (nonprofit plan) for events, news, pages, and images.
**Why:** The editing experience is good enough for non-technical volunteers, the image
pipeline handles volunteer phone photos well, and the nonprofit plan removes the cost
objection. The team is comfortable with modern web tools.
**Tradeoff:** Content lives in Sanity's cloud rather than in git. The Studio is a
codebase with its own upgrade obligations. Mitigated by weekly dataset exports.
**Alternatives considered:** Google Sheets + Apps Script publishing (less to maintain,
weaker images and editing); Decap/Sveltia CMS (free, but Netlify Identity and Git
Gateway are deprecated and Decap is stagnant).
**Revisit if:** the nonprofit plan is withdrawn, or Studio maintenance becomes a burden
nobody can carry.

## 003 — Plain CSS, no framework
**Date:** 2026-07
**Decision:** Design tokens and hand-written CSS. No Tailwind, no CSS-in-JS.
**Why:** A future maintainer can open a .css file and understand it. A utility framework
plus build config is a wall for someone with basic web skills.
**Tradeoff:** Slower to author, more discipline required to stay consistent.
**Revisit if:** a paid developer takes over long-term maintenance.

## 004 — Production deploys only via merge to main
**Date:** 2026-07
**Decision:** No CLI production deploys. Netlify builds on push to `main`.
**Why:** Git history stays an accurate record of what is live. Keeps a human in the loop
on publication while still letting agents work end-to-end via pull requests.
**Revisit if:** never, ideally.

## 005 — Batched build triggers
**Date:** 2026-07
**Decision:** The Sanity webhook triggers at most one build per day.
**Why:** Netlify's free plan meters builds, and exceeding the allowance suspends the
site for the rest of the calendar month.
**Revisit if:** the public-good plan is approved with materially different limits.
