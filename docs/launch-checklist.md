# Launch checklist

Everything that must be true before `fotvg.org` points at this site.

These obligations were accumulating across half a dozen files and code comments. This is
the one place to look. Work top to bottom; the order roughly matches the dependencies.

---

## Content and permissions

- [ ] **Photo attribution confirmed for the July batch.** Every photograph currently
      credited "Betsy Cooper" needs its actual photographer verified — the credits in the
      mock-ups were assumptions, and at least one was wrong. Decision 013, `docs/photos.md`.
- [ ] **Written board sign-off for any identifiable child** in any published photograph.
      Not a verbal nod. Written.
- [ ] **Location data stripped** from anything taken at a private home, before upload.
      Sanity keeps the original file, so doing it afterwards is too late.
- [ ] **Every `[TK]` marker gone.** Search the repository for `tk` *and* look through the
      Studio — some live in content, not code.
- [ ] Copy read once end to end for American English. The board has asked twice.

## The Donate button

- [ ] **Real Square URL in Site settings.** Until it is there the site renders a dead
      placeholder reading "Donate — link pending", which must never reach the public.
- [ ] Tax-deductibility wording confirmed with the board.
- [ ] Donation flow tested on an actual phone, not a desktop browser window.

## Accounts

- [ ] **FotVG's own Netlify account exists** and the site is connected to this repository.
      The prototype runs on John's personal account (decision 015).
- [ ] Netlify open-source / public-good application approved, or the build allowance
      checked against about 32 builds a month.
- [ ] **Sanity nonprofit plan approved.** The Growth trial expires around 27 August 2026;
      after that the project drops to the free plan, whose quotas have no overage — at
      100% the public API stops serving and content vanishes from the live site.
- [ ] Two people can get into every account. Password vault current.

## The switchover itself ⚠️

- [ ] **Record the full DNS zone before touching anything.** Screenshot it into
      `docs/hosting.md`.
- [ ] **Confirm the MX records and preserve them.** FotVG's email runs on Google
      Workspace through this domain. Changing nameservers without carrying the MX records
      across breaks the organization's email. This is the single most damaging mistake
      available on this project.
- [ ] `site:` in `astro.config.mjs` changed to `https://fotvg.org`. Canonical URLs, the
      sitemap and every Open Graph tag derive from it.
- [ ] **`public/robots.txt` disallow-all removed.** It exists to keep the prototype out of
      search results; leaving it would keep the real site out too.
- [ ] Trigger a build after both of the above — neither takes effect until then.
- [ ] The old GoDaddy site retired only *after* the new one is confirmed serving.
- [ ] **The editors' guide in Drive updated.** "Putting things on the FotVG website"
      names `fotvg-webtest.netlify.app` as the site address, which will be wrong.

## Checks worth doing once

- [ ] Lighthouse on mobile: performance ≥ 95, LCP under 2s, zero layout shift.
- [ ] Tab through every page with no mouse. Everything reachable, focus always visible.
- [ ] One page read start to finish with a screen reader.
- [ ] Every page at 200% browser zoom, and at 400%. No horizontal scrolling.
- [ ] Share a link to an event on Facebook and check the preview card looks right.
- [ ] The favicon, seen by the board at actual size in a browser tab (decision 021).

## Handover

- [ ] `docs/runbook.md` complete, including the "Who to contact" section.
- [ ] A dataset backup has actually been taken and a restore tried at least once.
- [ ] Both editors have published something themselves, unaided.
- [ ] Someone other than John knows this document exists.
