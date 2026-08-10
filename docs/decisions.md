# Decision log

Short entries. What was decided, why, and what would make us revisit it.
Append new entries at the bottom. Do not rewrite history — supersede instead.

---

## 001 — Static site (Astro) rather than WordPress
**Date:** 2026-07
**Decision:** Build a static site with Astro, hosted on Netlify.
**Why:** No ongoing security patching, no plugin update treadmill, near-zero hosting
cost, fast on rural connections. FotVG has one technical volunteer; a WordPress install
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

## 006 — Replace the GoDaddy site rather than migrate it
**Date:** 2026-07-29
**Decision:** The existing fotvg.org, built in GoDaddy's site builder by a previous
volunteer, is treated as **evidence of intent, not as a template**. We rebuild on
Astro + Sanity + Netlify and cut over when the new site is at least as complete.
**Why:** The GoDaddy site tells us what the board thought was important — the programs
they chose to feature (VGAP, Greenworks, events), the tagline they adopted in practice,
the fact that they wanted a sign-up form. That is genuinely useful input. But its
structure is a page-builder's structure, its content cannot be reused mechanically, and
the volunteer who built it has moved on. Copying it would inherit constraints without
inheriting any advantage.
**Tradeoff:** Everything has to be rewritten rather than imported. For a site this size,
that is a smaller cost than working around a page builder's markup.
**Watch out:** `fotvg.org` DNS currently points at GoDaddy, and FotVG's email runs on
Google Workspace through the same domain. **Changing nameservers without preserving the
MX records will break the organization's email.** Record the full zone in
`docs/hosting.md` before touching anything.
**Revisit if:** the board decides the current site is good enough as-is.

## 007 — Square for donations
**Date:** 2026-07-29
**Decision:** The donate button links out to Square. No payment handling on this site.
**Why:** Square is already FotVG's card processor — they use it at events and own the
readers, so the money lands where the treasurer already reconciles it, with no new
account, no new merchant relationship, and no new reconciliation process to learn.
**Tradeoff:** The donation flow leaves the site, which costs some conversion. Accepting
that is far cheaper than taking on PCI scope for a volunteer organization.
**Revisit if:** Square's donation flow proves unusable on a phone, or the treasurer
moves processors.

## 008 — Event recaps with photo galleries are in scope
**Date:** 2026-07-29
**Decision:** Events carry an "after" phase — a short write-up plus a curated photo
gallery — on the same document as the announcement. Past events stay published
indefinitely with durable URLs.
**Why:** The board asked for a "solid landing site", but separately asked to advertise
upcoming events and show the results of past ones. The reason is grant applications:
recaps are the evidence that FotVG delivers what it says it will. That makes them one of
the highest-value things on the site, not an optional extra.
**Tradeoff:** More schema than a pure brochure site, and an ongoing content obligation —
a recap that never gets written is worse than no recap section. Mitigated by keeping it
one document rather than two, so there is nothing to remember to link up.
**Revisit if:** recaps consistently go unwritten, which would mean the workflow is wrong.

## 009 — Two trained Studio editors, not the whole board
**Date:** 2026-07-29
**Decision:** One or two board members get Sanity Studio accounts and publish. Everyone
else contributes photos and text through a shared Google Drive folder per event.
**Why:** Photo permission is the real risk on this site — identifiable children, private
gardens, people who did not agree to appear. A small number of trained publishers gives
that check somewhere to actually happen. It also means two people to train rather than
eight, on a board whose composition changes every year.
**Tradeoff:** A publishing bottleneck. Contributors cannot self-serve.
**Revisit if:** the bottleneck becomes the reason recaps don't get published.

## 010 — Mock-up 2, "The Evidence", is the design direction
**Date:** 2026-08-09
**Decision:** Build on the visual language of mock-up 2 — deep forest-green hero band,
serif headlines, brass accents, full-width alternating photo bands, past write-ups given
more weight than the upcoming list.
**Why:** Betsy's pick after seeing all three on a phone and a laptop. It is also the one
that best serves the grant-reviewer audience, which is the reason recaps exist
(see 008). Mock-ups 1 and 3 are retired as directions.
**Tradeoff:** It is the most photo-hungry of the three and looks thin without six to
twelve good pictures per event. That makes the photo pipeline (`docs/photos.md`)
load-bearing rather than nice-to-have.
**Borrow from mock-up 3:** the "three organizations share the name" disambiguation needs
the prominence it had in mock-up 3 — its own bordered card with a heading, in the page
flow. In mock-up 2 it is quiet footer text, and Betsy wants it louder. This is the one
element being carried across.
**Revisit if:** the photo supply never materializes, in which case mock-up 1's
typographic approach degrades far more gracefully.

## 011 — A page per program area
**Date:** 2026-08-09
**Decision:** Village Green Arts Program, Greenworks, and Community building each get
their own page, carrying mission, vision, and related information. Where an event names
its program — "Music at the Green · Village Green Arts Program" — that attribution is a
live link to the program page.
**Why:** Betsy asked for it. The three areas are how the board thinks about its own
work, and grant applications are written per program. It also gives the Greenworks
mission and vision (now in `docs/organization.md`) somewhere to live.
**Implication for the content model:** `program` is already a field on event rather than
navigation (see `docs/content-model.md`), which was the right call and does not change.
What changes is that the field's values now need to resolve to real pages — so program
becomes a referenced document with a slug, not a free-text string or enum.
**This kills the four pillars.** Confirmed by John, 9 August 2026: the pillars taxonomy
is retired outright, not merely set aside for navigation. It does not structure the site
and does not appear in copy. The three program areas are the organizing idea.
**Revisit if:** the board adds a fourth area, which they expect to over time.

## 012 — A "What we're dreaming about" page
**Date:** 2026-08-09
**Decision:** Add a page where the board documents ideas it is developing but has not
yet started — things it may be seeking grants for.
**Why:** Betsy's idea. Two purposes: it is a soft call for volunteers who want to help
build something rather than staff something that already runs, and it gives a grant
reviewer a view of direction and ambition. For an organization founded in 2025 with a
short delivery history, stated intent does real work.
**Tradeoff:** A page of unfulfilled ideas ages badly. Each entry needs a date and an
honest status, and the page needs a review cadence or it becomes evidence *against* the
organization. Put the review in `docs/runbook.md` when the page is built.
**Careful:** nothing on this page may read as a commitment or a solicitation for a
specific unfunded project. Keep it plainly aspirational.
**Revisit if:** entries go more than a year without being updated.

## 013 — Photo credit: Karen Jeyes
**Date:** 2026-08-09
**Decision:** The *Music at the Green* hero photograph — the dancing-on-the-grass shot
used in mock-up 2's hero and mock-up 3's featured card — is credited to **Karen Jeyes**,
not Betsy Cooper.
**Why:** Karen worked closely with Betsy and contributed part of the batch that reached
us via Betsy. She has given explicit permission for her photographs to be used.
**Action outstanding:** the batch from Betsy is mixed. Every photo currently credited
"Photo: Betsy Cooper" needs its actual photographer confirmed before launch — the
credits in the mock-ups are assumptions, not records. Track attribution per file in
`docs/photos.md`.
**Revisit if:** never; get it right instead.

## 014 — Recap layout must put the title before the photographs on mobile
**Date:** 2026-08-09
**Decision:** In the recap bands, the heading and date come before the image block in
**source order**. Desktop keeps the current side-by-side arrangement via CSS ordering,
not by reordering the DOM.
**Why:** Betsy found this on a phone. Mock-up 2's `.recap` grid puts the photo `<div>`
first in the markup, so on a narrow screen the photographs appear *above* the heading
they belong to. Scrolling from one recap to the next, you meet the Greenworks photos
while still reading the Music at the Green write-up, and the association breaks. Desktop
rendering is fine — this is purely a small-screen source-order bug.
**How:** put the text block first in the DOM and use `order` on the image block at the
wide breakpoint. That also fixes it for screen readers, which follow source order at
every width, so this is an accessibility fix as much as a layout one.
**Revisit if:** never. Source order should match reading order.

## 015 — Prototype on John's personal Netlify, switch accounts before go-live
**Date:** 2026-08-09
**Decision:** Build and review the whole site on `fotvg-webtest.netlify.app`, under John's
personal Netlify account. When it is ready, create a Netlify account owned by FotVG,
connect it to the same repo, attach `fotvg.org`, and deploy there.
**Why:** It removes the account-creation and nonprofit-approval steps from the critical
path — the repo is the asset, and connecting a repo to a new Netlify site is a
five-minute job. John has filed, or is filing, the Netlify open-source/public-good
application in parallel.
**Tradeoff:** Prototype builds spend John's personal build credits, and Netlify Forms
submissions during this phase land in his account, not FotVG's. So the contact form must
not be publicized before switchover.
**Consequences to remember at switchover:** `site:` in `astro.config.mjs` is currently
`https://fotvg-webtest.netlify.app` and feeds canonical URLs and the sitemap — it has to
change to `https://fotvg.org` and be rebuilt. The disallow-all `public/robots.txt` has to
be removed at the same time, and the Sanity CORS origins re-pointed.
**Revisit if:** the nonprofit account is approved early enough to build on it directly.

## 016 — Create the Sanity project now, apply for the nonprofit plan afterwards
**Date:** 2026-08-09
**Decision:** Create the `production` project inside the existing "Friends of the Village
Green" Sanity organization before the nonprofit application is filed.
**Done, 9 Aug 2026:** project `FotVG Website`, project ID `nd22vlzw`, organization ID
`o7rU0mAV3`. It came up on a **Growth Trial with 18 days left**, so it expires around
**27 August 2026** and drops to the free plan unless the nonprofit plan lands first.
That puts a date on the application — see the note at the end of this entry.
**Why:** A project ID is issued when a *project* is created, not when a plan is approved,
and nothing in the schema or the Astro wiring can start without one. Approval takes days
to weeks; there is no reason for the build to wait on it. The nonprofit plan is applied
to an existing project later.
**Why inside the FotVG organization specifically:** projects are owned by whoever creates
them, and the plan attaches to the organization. Creating it in the right org from the
start avoids the ownership transfer that `SETUP.md` §0.5 was written to handle, and means
Kathleen or Betsy can submit the application against an organization that already holds
the real project.
**Watch out:** free-plan quotas have no overage. At 100% of the API, CDN, or bandwidth
allowance, public API access is blocked and content stops loading on the live site.
Warning emails go to project admins at 80%. During prototyping the traffic is negligible,
but do not still be on the free plan at go-live.
**Action with a date on it:** the nonprofit application should be submitted well before
**27 August 2026**. Approval reportedly takes days to weeks, so filing in the last week
of the trial is cutting it fine. Nothing breaks at expiry — the project drops to the free
plan and the build continues — but any Growth-tier feature we have started relying on
would stop, so do not build anything on a paid-tier feature until the plan is settled.
**Revisit if:** the nonprofit application is rejected, which would make the quota ceiling
a live design constraint rather than a footnote.

## 017 — Photo-free copies of the mock-ups are committed; the originals are not
**Date:** 2026-08-09
**Decision:** The original mock-ups are gitignored and stay on John's machine and in
FotVG's Drive. Alongside them sit `*-no-photos.html` copies — same markup, same classes,
same alt text, with each photograph replaced by a grey SVG placeholder — and those are
committed. 13 MB becomes 129 KB.
**Settled by:** John confirmed on 9 August 2026 that the GitHub repository is **public**,
which turns the concern below from a question into a straightforward no.
**Why:** The three mock-ups are about 13 MB, almost all of it real event photographs
embedded as base64 — Kathleen's Greenworks pictures and the batch that came via Betsy.
Two of the project's hard rules bear on that: no photograph is published without
confirmed permission, and none containing identifiable children without written board
sign-off. Decision 013 records that attribution across that batch is *unconfirmed* and
that fixing it is an outstanding pre-launch action. Git history is effectively permanent
— removing a file later does not remove it from the history — so committing them now
would be irreversible while the permission position is still unsettled.
**Also:** it is 13 MB that Netlify would clone on every single build, for files that are
never part of the site.
**What we lose:** nothing that matters. Every `<img>` keeps its tag, classes and alt
text, so the stripped files render with the same grid, the same aspect ratios and the
same source order. They are still usable for porting a section into real code, which is
the only thing anyone will open them for. The photographs themselves were never the part
we needed to consult.
**Also worth having removed:** 13 MB that Netlify would otherwise clone on every build,
for files that are never part of the site.
**How they were made:** every `"data:image/…"` attribute value swapped for an inline grey
SVG, with the generator refusing to write a file if any non-SVG image data survived. The
banner comment at the top of each file records where the originals live.
**Revisit if:** the attribution and children's sign-off in decision 013 are ever fully
settled *and* someone actually needs the photographs in git — which is unlikely, since by
then the pictures will be in Sanity where they belong.

