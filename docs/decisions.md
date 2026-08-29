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
same alt text, with each photograph replaced by a gray SVG placeholder — and those are
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
**How they were made:** every `"data:image/…"` attribute value swapped for an inline gray
SVG, with the generator refusing to write a file if any non-SVG image data survived. The
banner comment at the top of each file records where the originals live.
**Revisit if:** the attribution and children's sign-off in decision 013 are ever fully
settled *and* someone actually needs the photographs in git — which is unlikely, since by
then the pictures will be in Sanity where they belong.


## 018 — Three dependencies for the Sanity read path
**Date:** 2026-08-09
**Decision:** Add `@sanity/client`, `@sanity/image-url`, and `astro-portabletext`.
**What each does, and what would replace it:**
- `@sanity/client` — fetches content over GROQ. If it were ever abandoned, the same
  queries work as plain HTTP GETs against `https://<projectId>.api.sanity.io`; the client
  is convenience, not a lock-in. Perhaps thirty lines to replace.
- `@sanity/image-url` — turns an image reference into a CDN URL with width, crop and
  format applied. Replaceable by hand-building the URL, but the hotspot and crop maths
  is fiddly enough that hand-rolling it would be a false economy.
- `astro-portabletext` — renders Sanity's rich text to HTML. The most replaceable of the
  three: Portable Text is a documented JSON shape and a small serializer is a known
  quantity if the package goes stale.
**Why these are acceptable when the standing rule is to resist dependencies:** all three
are first-party or near-first-party to a service the project has already committed to,
and the alternative is reimplementing the same logic with fewer eyes on it. The project's
conventions list all three as reasonable in advance.
**Tradeoff:** four direct dependencies now instead of one. Each is an upgrade obligation.
**Revisit if:** we leave Sanity, at which point all three go together.

## 019 — The project ID lives in the repository; there is no read token
**Date:** 2026-08-09
**Decision:** `src/lib/sanity.js` defaults to project `nd22vlzw`, dataset `production`,
with environment variables able to override. No API token is used anywhere.
**Why this is safe:** the `production` dataset is **public** — verified on 9 August 2026
by an unauthenticated query returning HTTP 200. Anyone can already read this content;
it is a public website. A Sanity project ID is not a credential, and ships in the browser
bundle of every Sanity-backed site. The thing that would be a secret is a token, and
there is no token because a public dataset needs none.
**Why a default rather than a required variable:** an unset environment variable in
Netlify would fail the build and take the live site down, in exchange for protecting a
value that was never sensitive. A site that builds with no configuration at all is one
fewer thing for a volunteer to get wrong.
**Two console steps this removes**, both of which `SETUP.md` still described: no read
token to create and store, and no CORS origins to configure — CORS governs browser
requests, and this site fetches at build time from Node.
**Revisit if:** the dataset is ever made private, which would require a viewer-scope
token in Netlify's environment variables and a `.env` for local builds. Never a write
token.

## 020 — No search
**Date:** 2026-08-10
**Decision:** Pagefind is dropped. The site has no search.
**Why:** John's call, and the right one. The site is about ten pages plus a growing list
of events. Everything is reachable in two clicks from the home page, and the events list
is short enough to read. A search box on a site this size mostly advertises that the
navigation failed. It is also a build step, an index to keep current, and another thing
a future maintainer has to understand.
**Removed from:** the stack table in `CLAUDE.md`, the dependency list in the
`astro-conventions` skill, and Phase 8 of `SETUP.md`. Carrying an unimplemented
commitment in the docs is worse than not having it — it reads as an oversight to whoever
picks this up next.
**Revisit if:** the event archive grows past roughly fifty write-ups, at which point
finding "that concert two summers ago" stops being easy by eye.

## 021 — A typographic tab icon, not a logo
**Date:** 2026-08-10
**Decision:** The board declined a logo or emblem — the site's identity is the
organization's name set in type, which is why the header is text. For the browser tab,
`public/favicon.svg` sets the abbreviation in the site's serif, brass on the forest
green of the hero band, on two lines.
**Why two lines:** a favicon is often painted at 16 pixels. Five characters on one line
at that size is a smudge; two short lines keep the strokes thick enough to read.
**What it replaced:** the Astro scaffold's own favicon, which had been live on the test
site the whole time. FotVG's website was showing Astro's logo in every visitor's browser
tab and bookmark.
**How to change it:** `public/favicon.svg` is the source. `favicon.ico` and
`apple-touch-icon.png` are generated from it — regenerate both if it changes, or the tab
and the iOS home-screen icon will disagree.
**Revisit if:** the board ever commissions a mark. This is a stand-in that does not
pretend otherwise.

## 022 — The home page photograph is chosen by hand
**Date:** 2026-08-10
**Decision:** The large photograph on the home page comes from a `heroImage` field on
Site settings, picked deliberately, rather than being pulled automatically from the
newest event write-up.
**Why:** John's call. The automatic version is tempting — it keeps the page fresh with
no effort — but it hands the most prominent image on the site to whichever event was
written up most recently, including one with a mediocre photograph or an awkward crop.
The first thing a visitor or a grant reviewer sees is worth a deliberate choice.
**Tradeoff:** it goes stale if nobody changes it. That is a smaller risk than the
alternative, and the runbook can carry a reminder.
**Fallback:** with no photograph set, the hero falls back to the plain green panel from
mock-up 2. Tidy, and much less inviting — which is the correct incentive.

## 023 — The home page wording is editable, and falls back to the code
**Date:** 2026-08-11
**Decision:** The hero's small line, headline and introduction move to Site settings as
`heroEyebrow`, `heroHeading` and `heroLede`. Every one of them falls back to the copy in
`src/pages/index.astro` when empty.
**Why:** John's call. The board owns this wording — it is the sentence that says what
FotVG is — and needing a developer to change a headline is the wrong dependency for an
organization with one technical volunteer. The photograph was already theirs to choose
(decision 022); the words sitting on top of it were not.
**Why the fallback, rather than requiring the fields:** `initialValue` only fires when a
document is created, and `siteSettings` already exists — so a required field would have
shipped as a validation error on an empty box, with the live home page headline gone.
Falling back to code also means clearing a field to start again cannot blank the page.
**Why `heroLede` is not `blockContent`:** it allows paragraphs and bold, nothing else. A
heading, a bulleted list or a link in a hero paragraph would all render, and all three
would look broken. The hero's styling only knows how to render bold.
**Where the default copy lives:** the template, not `site.js` and not the schema. It has
to agree with a design that wraps the headline at about sixteen characters and colors
the bold — that agreement is only checkable in the file holding the CSS.
**Consequence:** `npx sanity deploy` is needed before editors can see the new tab. This
is the change that gets forgotten — see `docs/runbook.md`.

## 024 — The footer is two labeled columns
**Date:** 2026-08-11
**Decision:** The footer's links move out of a full-width strip and into a column headed
"More about us", beside a "Find us" column carrying the address, email and social links.
Both sit under the 2px brass rule the rest of the site uses above a heading. The
corporate status line moves below a hairline of its own.
**Why:** the strip was built for four standing pages and is currently holding one. No
`page` documents have been written yet, so "The board" — the one footer link added by
hand rather than coming from an editor's page — was rendering alone above a divider and
reading as something left behind rather than something placed. John raised it.
**Why a rule and an eyebrow rather than just tidier spacing:** the brass rule above a
label is the site's signature device; it carries "What we support" on the home page and
every name on the board page. Repeating it in the footer makes the footer the last two
items in that sequence. One link under a heading reads as deliberate in a way one link
in a strip does not.
**It also scales the right way:** as About, Contact and Get Involved get written they
stack in the same column, and nothing needs revisiting.

## 025 — The remaining Dependabot alerts are Sanity's CLI, and we wait for Sanity
**Date:** 2026-08-12
**Decision:** Two of the thirteen open alerts are fixed by lockfile updates. The other
eleven are left open deliberately. No `overrides` block, and no `npm audit fix --force`.
**What was fixed:** `js-yaml` 4.3.0 → 4.3.1 in both trees — in the site via Astro, in the
Studio via ESLint. Both are within the existing semver ranges, so `package.json` is
untouched in both trees and the change is entirely in the lockfiles.
**What is left, and why it is acceptable:** the other eleven alerts are four packages —
`js-yaml` 3.13.1, `undici` 7.28.0, `uuid` 10.0.0, `smol-toml` 1.5.2 — and every one of
them is nested under `@sanity/cli`. That is the command-line tool that runs `sanity
build` and `sanity deploy` on a maintainer's own laptop. It is not the Studio that
editors open in a browser, and it is not on the website.

Two checks establish that rather than assuming it:

- **The website ships no JavaScript at all.** Eleven built pages, zero `.js` files, not
  one `<script>` tag. Nothing in the site's dependency tree can be reached by a visitor,
  so every alert there is build-time only by construction.
- **The deployed Studio bundle does not contain any of them.** Grepping the 530K build
  output for `js-yaml`, `undici`, `smol-toml`, `@vercel/frameworks` and
  `module-federation` returns nothing. The vulnerable code never leaves the laptop.

**Why not `--force`:** it resolves these by installing **sanity 5.14.1** — a major
*downgrade* from 6.9.2, which would break the Studio that two editors are now using
daily. Not a close call.
**Why not `overrides`:** forcing patched versions into a vendor's CLI subtree would put
four entries in `studio/package.json` that a future volunteer has to understand, could
break `sanity deploy` in ways `sanity build` would not catch, and would go stale and
start pinning *old* versions once Sanity ships its own fix. That is a poor trade against
code with no untrusted input path — the CLI talks to Sanity's own API. These clear when
Sanity updates `@sanity/cli`, and `npm audit` will pick that up on its own.
**Also bumped:** `sanity` and `@sanity/vision` 6.9.1 → 6.9.2, within the existing `^6.9.1`
range. This fixed **zero** alerts and earns no security credit. It is here because local
and runtime versions had drifted, which made `sanity deploy` stop and ask on every run.
That prompt is now gone.
**Revisit if:** any alert appears against a package the site actually builds with, or
against something in the Studio's browser bundle. The two checks above are the test —
re-run them rather than trusting this entry.

## 026 — The display face is "Friendly", not the serif
**Date:** 2026-08-12
**Decision:** Headings move from the Constantia serif stack to `"Trebuchet MS",
"Lucida Grande", "Lucida Sans Unicode", Tahoma, sans-serif`. Body text is unchanged.
**Why:** the board's choice from the four-way comparison page built on 10 August, where
each option was shown as a full working page rather than a specimen. "Friendly" was
described there as warm and slightly informal, with open letterforms — approachable
without being jokey, and the closest of the four to how the group actually sounds in
writing. That last part is the reason it won.
**Supersedes:** the "serif headlines" half of decision 010. Everything else about
mock-up 2 — the forest-green band, the brass, the photo bands, the write-ups-first
ordering — stands untouched.
**Still no webfont.** Every face in the new stack is already on the machine, so this
remains a zero-request change. Trebuchet MS covers Windows and most Macs, Lucida Grande
is the older Mac fallback, Tahoma the last resort. Verified rendering as Trebuchet
rather than silently falling back.
**Two adjustments that came with it, neither cosmetic whim:**
- **Weight 600 → 700.** Every face in this stack ships only 400 and 700. Asking for 600
  was already getting 700; the CSS now says what it means, in `global.css` and in the
  two components that set the display face themselves.
- **Tracking loosened, -0.02em → -0.015em.** A serif's own shapes hold a tight line
  together. Trebuchet's open letterforms are precisely what makes it read as friendly,
  and tightening them takes that back out. -0.015em is the comparison page's value. `h1`
  keeps a little extra tightening at -0.02em because it renders up to 4.6rem, where
  tracking that looks open at 1.75rem looks gappy.
**Two consequences worth knowing:**
- **The favicon now disagrees with the site.** Decision 021 set the tab icon in "the
  site's serif", and `public/favicon.svg` hardcodes Georgia. It was left alone rather
  than half-changed: `favicon.ico` and `apple-touch-icon.png` are generated from that
  SVG, and this machine has no ImageMagick, Inkscape or rsvg-convert to regenerate them.
  Changing the SVG alone would produce exactly the disagreement decision 021 warns
  about. On the launch checklist.
- **The disambiguation card is quieter.** Its paragraph is set in the display face,
  which against a serif read as a pull-quote. Sans against sans is a subtler contrast —
  still visible (different face, 16.3px against the body's 18px), and the card's
  prominence was always carried by its brass left border and tinted panel rather than
  the typeface. Worth a look on the deploy preview; Betsy asked for that card to be
  loud, and she is the one to judge whether it still is.

## 027 — The home page copy blocks are editable, and "more" is not a program
**Date:** 2026-08-12
**Decision:** The Donate text, the Volunteer text, the three-organizations notice and
the closing "And, we hope, more" card all move to Site settings. All four follow the
pattern set by decision 023 — an empty field restores the copy held in the template, so
the page is never headless. A new `simpleText` type carries all of them.
**Why:** Betsy and Kathleen asked for it after living with the site for a few days. The
board owns the words; needing a developer to adjust a sentence is the wrong dependency
for an organization with one technical volunteer.
**Why a shared `simpleText` type:** this is the fifth field of exactly this shape, and
five copies of the same inline definition is four too many. It allows paragraphs and
bold and nothing else — not `blockContent`, which stays the right type for the long-form
body of an event, program or page. The restriction is the point: these blocks sit inside
a fixed design rather than flowing down a page, and every control `blockContent` offers
would break one. A heading inside the green band competes with the band's own heading, a
list blows out the two-column grid, a link sits next to a button that is already the
call to action.
**What was deliberately left in code, and why it is not an oversight:**
- **The Donate button and the Square link.** A button is not copy.
- **The tax note.** It is a statement of corporate status, not marketing — see below.
- **The "Money" and "Time" eyebrows.** Two one-word design labels.
**The tax-deductibility TK is closed.** The fine print now reads "Donations are handled
by Square. Friends of the Village Green is a 501(c)(3) nonprofit, so your donation is
tax-deductible." The determination was received in 2025 (`docs/organization.md`), and
John confirmed with the board on 12 August. The EIN stays off the site — that same file
lists it as not for publication. This is the last of the three TK markers; the built
output now contains none.
**"And, we hope, more" is not a program, and must never become one.** It was a fourth
card in mock-up 2, sitting in the same grid as the three program areas but saying the
list is expected to grow. Creating it as a `program` document would have given it a
slug, a page of its own at `/programs/...` with no mission or body behind it, and a
place in the reference picker where an editor could attribute a real event to it — a
grant reviewer clicking through to an aspiration is the opposite of the evidence that
page exists to provide. It is a field on Site settings and renders as a card with no
link. `docs/organization.md` still says three programs, and that remains true.
**Consequence:** `npx sanity deploy` is needed before editors see the new tab, the new
boxes, or any of this. It is the step that gets forgotten — see `docs/runbook.md`.

## 028 — One Square link per fund, not a "which program?" box
**Date:** 2026-08-18
**Decision:** The Donate section gains three things: a sentence inviting the donor to
cover Square's processing fee, a sentence offering the alternative of a check, and — for
anyone who wants their gift to go to one program — a small set of links to *separate
Square donation links*, one per program. All three are Site settings fields, so the
board owns the words and the links without a developer.
**Who decided:** Betsy Cooper, Catherine Farrell and Karmenn Hanson met on 18 August
2026 and agreed it, after the research John circulated on 14 August. Betsy's summary
email is the record.
**Why not Square's own custom field:** a Square donation link can carry up to two custom
fields, and they were the obvious way to ask "which program?". Two things rule them out.
They are free text — the API's `CustomField` object has one property, `title`, with no
type and no list of options, so there is no dropdown and no way to stop a donor writing
"the garden one" or leaving it blank. And the answer reaches FotVG only by logging into
Square and opening the individual payment: it appears on the donor's receipt but *not*
on the notification email the organization receives. That is a manual step every time,
forever, done by whoever is treasurer that year.
**Why separate links work better:** a payment link's title arrives as the order source on
the transaction, so it is in the Dashboard listing and in the CSV export without anyone
typing or transcribing anything. Square's own support staff give the same answer when
asked for a program dropdown. The cost is three links to keep alive in Square instead of
one, and three sets of words on the site instead of one — both visible, neither silent.
**Why not a donation platform with a real "cover the fee" checkbox:** Givebutter,
Donorbox, Zeffy and Classy all have one. Adopting any of them means replacing Square,
which is already FotVG's card processor, and handing a second service to the one
technical volunteer. Against decision 007 that is a bad trade for a checkbox.
**Why not an email to `info@fotvg.org` announcing the designation:** Betsy's own
suggestion, and the right instinct, but the mechanics do not hold. The donation happens
on Square's page; once the donor leaves this site it never learns whether the payment
completed or for how much. The email would say someone *intended* to give to Greenworks,
and the treasurer would still have to match it against Square by hand — two records
instead of one. The separate links attach the answer to the payment itself.
**Why "about 4%":** Square takes 3.3% + 30¢ on the free plan (decision 007 notes the
plan). That is 4.5% of a $25 gift and 3.6% of $100, so "about 4%" is honest across the
range people actually give. The copy carries two worked examples deliberately: "add a
few dollars", the wording first proposed, is twelve percent of a $25 gift and almost
nothing on $500.
**Why the fee and check sentences are their own fields** rather than extra paragraphs of
the Donate text: they say different things, and an editor rewriting the appeal should
not be able to delete the fee ask by accident.
**Still open, and both belong to the board:** whether mail addressed to the Community
Center reliably reaches the treasurer, and whether the bank will accept a check made out
to "FotVG" rather than the full name. The site says the full name until someone says
otherwise.
**Consequence:** `npx sanity deploy` before editors see the new fields, and the three
Square links have to exist before the program links are filled in — see
`docs/runbook.md`.

## 029 — The home page write-ups are chosen, not computed
**Date:** 2026-08-21
**Decision:** A `featuredOnHome` checkbox on the event decides which write-ups appear on
the home page under "What we've done". With none ticked, the page falls back to the
three most recent write-ups — the behavior it had before this change.
**Why:** It used to be "the three newest with a write-up", which looked deterministic and
was not. It happened to produce one event per program area, which is what the board
thought they were seeing; write up two more summer concerts and the home page would have
become three concerts with no warning. The board wanted the choice to be a decision, and
to be able to feature more than three when the upcoming list is thin.
**Why the fallback is not optional:** "featured" starts as a field nobody has ticked.
Without a fallback the most important section on the site — the one a grant reviewer is
sent to look at — would disappear the day this shipped, and disappear again the first
time an editor cleared the boxes. A section that is one unticked checkbox away from
empty is a trap, not a feature.
**Capped at six**, in `src/pages/index.astro`. Each featured write-up renders as a full
alternating band, so ten would push the Donate section somewhere nobody scrolls. The
field description says three or four is what the page carries comfortably.
**Tradeoff:** the home page no longer updates itself when a write-up is added. That is
the point, but it means a newly written-up event does not appear there until somebody
ticks the box — and because content publishes are batched (decision 005), not until the
next daily build either.
**Not done:** manual ordering of the featured events. They show newest first. Ordering
would need a number field on every event and editors keeping those numbers consistent
across documents, which is more machinery than the board has asked for.
**Revisit if:** the board finds themselves re-ticking boxes every month, which would mean
"the newest three" was the right rule after all.

## 030 — Events are archived, not deleted
**Date:** 2026-08-21
**Decision:** An `archived` checkbox on the event takes it off the site completely — the
listings, the home page, and its own page, which stops being generated. The document
stays in the Studio to be copied from. Every event query is built on a shared
`LIVE_EVENT` filter that excludes archived events.
**Why:** Deleting is currently the only way to stop showing an old event, and it is the
one action in this Studio that cannot be undone. The board wants to retire the weekly
summer concerts from the archive eventually without losing something they can clone for
next year.
**Why the page 404s** rather than staying up: "not shown on the website" should mean what
it says, and a page reachable by URL but linked from nowhere is a page nobody maintains.
The cost is real and worth stating — an old Facebook post pointing at an archived event
will break. That is the argument for archiving things nobody is still linking to, and it
is written into the field's description in the Studio.
**Write `archived != true`, never `!archived`.** In GROQ, `!archived` on a document
without the field evaluates `!null` → `null`, which is not true — so that spelling drops
*every* event rather than the archived ones. Nothing on the site would have rendered.
The same trap applies to `cancelled`, and `nextEventQuery` was quietly relying on
`initialValue: false` having been set on every existing document; it now uses
`cancelled != true` as well.
**Tradeoff:** a third checkbox on the event, and three is enough that they needed
explaining. The Studio's event list now shows ARCHIVED and CANCELLED in the subtitle, so
an editor scanning a list can see why something is not on the site.
**Revisit if:** editors start archiving things to tidy the Studio rather than the site,
which would mean they want a filtered view of the event list instead.

## 031 — Upcoming and past are two pages, and the past one filters by program
**Date:** 2026-08-21
**Decision:** `/events` lists what is coming up. `/past-events` is the archive of
write-ups, newest first, with a filter by program area at
`/past-events/greenworks` and one page per program. Interior pages get their own
heading size, `.page-title`, smaller than the home page's.
**Why two pages:** one page was doing both jobs, which is why its heading had to be
"What's on, and what we've done" — six words that rendered as three lines and 227 pixels
of heading before a reader reached anything. Each page now does one thing and can be
called what it is. `/events` keeps its URL, so nothing already shared breaks.
**Why the filter is links to real pages, not JavaScript:** it costs three generated pages
and buys four things. It works with JavaScript off and on a bad rural connection. Every
filter is an address that can go straight into a grant application —
`/past-events/greenworks` is a far better thing to give a funder than "go here and click
Greenworks". The back button behaves. And a screen reader gets ordinary navigation
rather than a list that silently changes underneath it. A script would have been one
page instead of four, and none of that.
**Only programs with a write-up get a filter link or a page**, so a filter can never lead
somewhere empty, and the first write-up for a new program brings its page into existence
on the next build with nobody doing anything. Same principle as the navigation in
`content.js`: build from what exists.
**A write-up with no program area** appears on `/past-events` and on no filtered page.
That is correct — the unfiltered page is the complete record — and it is why the filter
links say "Everything" rather than "All programs".
**Program pages now link to their own archive.** Until now a program page described the
work and showed none of it, which is a strange thing to hand a grant reviewer. The
write-ups are linked rather than repeated, so there is one list rather than two that
drift apart.
**Why the interior heading size is its own class** rather than a smaller `h1` everywhere:
the home page headline genuinely wants 4.6rem — it is the content, not a label on it.
The two cases are different and now say so.
**Relationship to decision 020 (no search):** that decision said to revisit at roughly
fifty write-ups, when finding "that concert two summers ago" stops being easy by eye.
There are five today. The filter is the cheaper half of that revisit, done early because
the weekly summer concerts are what will make the archive long, and retrofitting a filter
into a swamped page costs more than building it into an empty one. This is not search
and does not replace it.
**Tradeoff:** four pages where there was one, and three more on every build. At three
programs that is nothing; at fifteen it would be worth reconsidering.
**Revisit if:** the archive grows past roughly fifty write-ups even within a single
program, at which point the filtered pages want paging or dates as well.

## 032 — One heading per section, and a brass rule where the second one was
**Date:** 2026-08-21
**Decision:** The three home page sections lose their small-capitals line — WHAT WE HAVE
BEEN DOING over "What we've done", COMING UP over "What's on", WHERE THE MONEY GOES over
"What we support". A short brass rule goes above each heading instead. "See everything
we've done" becomes a button. The What's on section renders even when nothing is on.
**Why:** the small line was a paraphrase of the heading directly under it, so a reader
got the same thing twice and neither line earned its space. The board asked for it to go.
**Why a rule rather than nothing:** the small line was doing two jobs and only one of
them was words. It also put a hit of brass at the top of each section, which is what
separates one section from the next on a very long scroll. Dropping the words and keeping
the mark loses the repetition and keeps the rhythm. It is the same brass rule already
used on the program cards and the write-up cards, so it is the page's existing language
rather than a new device.
**What keeps its small line, and why:** "Money" over Donate and "Time" over Volunteer, on
the green band. Those are not paraphrases — they name the two things you can give, which
the headings do not say. The footer's "More about us" and "Find us" are column labels
with no heading under them at all. The test is whether the small line says something the
big one does not.
**The button.** "See everything we've done" was a line of bold text at the bottom of a
section about 2,500 pixels tall. It was competing with nothing and still being missed.
Making it a button meant fixing `.button`, which was hard-coded to the band's brass —
1.8:1 on the page background, which is why the event page had quietly grown its own copy
of the rule to undo it. It now reads `var(--color-accent)`, which `.band` already remaps,
plus a new `--color-on-accent` for the text that has to flip with it. One declaration,
legible in both places, and one duplicated override deleted. 8.3:1 on the band, 6.0:1 on
the page.
**Why What's on now renders empty.** The rule elsewhere on this page is that an empty
section does not render, because a heading with nothing under it reads as broken. An
empty *state* is a different thing. A home page that silently drops What's on between
seasons tells a first-time visitor nothing, and what it implies — a dormant organization
— is worse than the truth, which is that the concerts are seasonal. It uses the same
sentence as `/events`. `hasUpcoming` in `homeSectionsQuery` and the condition in
`getNav()` both went with it: the section always exists now, so nothing needed to ask,
and a field nobody reads is a field the next person has to work out.
**Tradeoff:** the sections are less distinct from each other than two lines of type made
them. If the board finds the page harder to scan, the answer is more space between
sections, not a second heading.
**Revisit if:** the board misses the extra line as a place to say something the heading
cannot — in which case it comes back as a real sentence under the heading, like the one
What we support already has, not as a paraphrase above it.

## 033 — `.prose` goes inside `.wrap`, never on it
**Date:** 2026-08-21
**Decision:** `class="wrap prose"` is wrong and is replaced everywhere by a `.prose`
element nested inside the `.wrap`. The links at the bottom of the events pages, the past
events pages and each event page become buttons, matching the home page.
**Why the nesting:** `.prose` is declared after `.wrap` in `global.css`, so on a combined
element its 38rem `max-width` wins — and `.wrap`'s `margin-inline: auto` then centers that
narrow box in the middle of the page. About us, Privacy, The board, `/events` and
`/past-events` all had it, so their titles sat centered while every event and program page
sat left. John spotted it on About us against an event page. Nesting keeps both behaviors:
the wrap centers the page container, the prose caps the measure, and the text starts at
the gutter like everything else. Every page title on the site now begins at the same
left edge.
**Why the buttons:** the home page's "See everything we've done" became a button in
decision 032 and was immediately more visible, but the same link at the foot of every
event page was still a line of bold text. One link, two treatments, on the same site.
A page that ends in a line of bold text ends in nothing.
**What stays a text link:** "See all upcoming events" on the home page. It is a
see-more-of-this-list link directly under a short list, not the one thing to do at the
end of a page, and two buttons on the home page would make neither of them mean anything.
It only renders when there are more than six upcoming events, so it is rare in any case.
**Guard:** the `.prose` rule in `global.css` now carries a comment saying not to put it on
a `.wrap`. It looks like it should work, which is why five pages did it.
**Found while checking, not fixed here:** the About us page body uses the h3 style (then
labeled "Subheading", renamed in decision 034)
for all five of its section headings, so the page runs h1 → h3 and skips a level. That is
content rather than code — the fix is to change them to "Heading" in the Studio. Demoting
or promoting heading levels in the template would fight the editor's choice everywhere
else.

## 034 — The rich-text headings are numbered, not named
**Date:** 2026-08-21
**Decision:** The two heading styles in `blockContent` are labeled **Heading 2** and
**Heading 3** rather than "Heading" and "Subheading". Every field using `blockContent`
carries the same sentence explaining that the page title is Heading 1 — one exported
`HEADING_GUIDANCE` constant, so the four descriptions cannot drift.
**Why:** the old names were ambiguous in two ways at once. The page already has a title
above the field, so "Heading" reads as though it might be that one; and nothing in either
name says which of the two outranks the other.
**What actually caused the mistake, though, was the preview.** The Studio renders h2 in
its style dropdown at Sanity's own default, which is far larger than the 32px this site
renders body headings at — `RichText.astro` scopes them down independently of the page
heading scale. An editor sizing by eye sees "Heading" looking enormous and picks
"Subheading", which is what happened on About us: all five section headings went in as
h3, so the page ran h1 → h3 and skipped a level. The editor's judgment was right about
the *rendered* size and wrong about the level, because the Studio showed them the wrong
size.
**Why numbers fix it:** 2 comes before 3 whatever the preview looks like, and it is the
convention from Word and Google Docs, which this board already knows. The stored values
are unchanged — `h2` and `h3` — so nothing already written moves and no migration is
needed. It does need a Studio deploy, like any schema change.
**Considered and not done: styling the Studio's editor to match the site.** Sanity allows
a `component` per block style, which would make the preview honest and remove the cause
rather than working around it. It means a React component in the Studio, a `.tsx` file
where there is currently none, and cosmetic Studio code for the one volunteer to maintain
— against the constraint in CLAUDE.md. Worth revisiting if editors keep picking the wrong
level despite the numbers, which would mean the visual is still beating the label.
**Not a decision, but the standing lesson:** the guidance sentence says why skipping a
level matters, in one clause, because an editor who knows the reason gets it right in
fields nobody has written guidance for.

## 035 — `main` is protected on GitHub, and nobody bypasses it
**Date:** 2026-08-21
**Decision:** A repository ruleset named `protect main` targets the default branch with
three rules — require a pull request before merging (zero approvals), block force pushes,
restrict deletions — enforcement active, and **no bypass actors**, so it applies to the
repository owner too.
**Why:** Netlify builds `main` automatically, so a direct push to `main` is an unreviewed
production deploy. Until 21 August 2026 nothing prevented one. The workflow in `CLAUDE.md`
— branch, PR, review the deploy preview, merge — was a convention that the tooling did
not enforce.
**Why zero required approvals:** FotVG has one technical volunteer, who is also the person
opening every pull request, and GitHub does not let anyone approve their own. Requiring
one approval would lock the only maintainer out of the repository. Zero still forces the
pull request, which is the part that matters: it produces the deploy preview.
**Why this rather than local permission rules alone:** Claude's local rules deny
force-pushes, branch deletion and anything naming `main`, but they match command strings,
and a bare `git push` while `main` is checked out names nothing. No pattern can catch it.
The ruleset is server-side and does not care how the push was spelled.
**`require_extra_approval_for_unattributed_changes` is set true and is inert.** GitHub's
documentation is explicit that it has no effect when the ruleset requires zero approvals,
and it concerns Copilot opening pull requests under its own app identity rather than
`Co-Authored-By` trailers. Left as GitHub's default rather than turned off, but it is not
doing anything.
**Checked before enabling:** the daily rebuild workflow declares `permissions: {}` and only
calls a Netlify build hook, so it does not push to the repository and is unaffected. Feature
branches are untouched — the ruleset targets only the default branch.
**Tradeoff, and it is real:** there is no emergency escape hatch. A one-line production fix
at nine in the evening has to go through a pull request. That is the intended cost, and the
faster remedy in a genuine emergency is the Netlify rollback in `docs/runbook.md`
— Deploys, last good deploy, Publish deploy — which needs no code change at all. Adding a
bypass actor is a two-click change to the ruleset if the board ever wants one.
**Revisit if:** a second maintainer appears, at which point required approvals of one
becomes possible and worth having.

## 036 — The hero is shorter, and it fades between photographs
**Date:** 2026-08-25
**Decision:** Two changes to the top of the home page, from the board's August review.
The band's own `padding-block` in `src/pages/index.astro` is deleted, so the hero uses the
same section padding as every other band on the site. And `heroImage` on Site settings
becomes `heroImages`, an array, which the page crossfades with a CSS animation and no
JavaScript.
**Why the padding went:** the board said there was too much blank space above the text.
There was, and it was an accident rather than a design: `section` in `global.css` already
gives every band `clamp(3rem, 8vw, 5.5rem)`, and the hero added `clamp(4rem, 14vw, 8rem)`
on top of it because nothing overrode the first. The two stacked. Measured on the built
page, that put **216px** above the eyebrow on a 1440px screen where the Donate band — the
other green band on the same page — has 88px, and 112px against 48px on a phone. Deleting
the hero's own rule brings it to 88 and 48, and the band goes from 872px tall to 616px.
**It was not the photograph, which was the first suspect.** The hero image is
`position: absolute; inset: 0`. It fills whatever box the section makes and contributes
nothing to its height; requesting a smaller crop would have changed the file size and not
moved the text by a pixel.
**And the space does not move to the bottom,** which was the worry. The band has no fixed
height, so trimming the top makes it shorter rather than pushing the gap downward — the
two ends are independent, and both now measure 88px.
**Why a CSS crossfade rather than a carousel:** no arrows, no dots, no pause button, no
JavaScript, nothing to keyboard-navigate and nothing to announce. The photographs are a
backdrop behind fixed text, not content a visitor moves through, so a carousel's controls
would be machinery around something nobody needs to operate. Seven seconds per photograph
with a 1.5-second overlap; each transition's two opacities sum to 1, so the green band
never shows through the join.
**The keyframes are generated in the template, not written in the stylesheet.** Each
photograph is visible for one Nth of the cycle and a keyframe stop is a percentage of that
cycle, so the stops move whenever the board adds or removes a picture. There is no way to
say "one Nth" in a percentage.
**Reduced motion is handled explicitly, and it had to be.** `global.css` collapses every
animation on the site to `0.01ms !important`, which for this one would have run it
instantly to its final keyframe — `opacity: 0` — and left the top of the home page a bare
green panel for every reader who has asked their computer for less movement. The hero sets
`animation: none` under `prefers-reduced-motion` and shows the first photograph, still.
**WCAG 2.2.2 (Pause, Stop, Hide) was considered and is judged not to apply,** which is a
judgment worth writing down rather than leaving implicit. The criterion covers moving,
blinking or scrolling *information* that runs for more than five seconds alongside other
content. These photographs are a backdrop: `aria-hidden`, decorative, carrying nothing a
reader could miss, with fixed text over them and no movement — only opacity. Combined with
the reduced-motion stop above, that is the reasoning. It is recorded as the single
documented exception in the `accessibility` skill, and it is not a precedent for a
carousel. If the board ever wants a pause control, it needs JavaScript and a visible
button, and that is a decision rather than a line of CSS.
**Alt text:** a single hero photograph keeps its alt text and is announced, exactly as
before. A rotating set is marked `aria-hidden` and treated as decorative — what a screen
reader would otherwise announce depends on which photograph happened to be up when the
page loaded, and reading all four out in a row describes nothing anybody can see.
**Decision 022 stands.** The photographs are still chosen by hand in Site settings rather
than pulled from the newest write-up. The board simply chooses more than one now.
**Migration:** `heroImage` is kept in the schema, marked deprecated, hidden the moment
`heroImages` has anything in it, and read by the site as a fallback. Deploying this cannot
blank the home page, and there is no script for a volunteer to run. Removing it is on the
launch checklist.
**Tradeoff:** every photograph in the array is downloaded by every visitor. The field caps
at six with a warning, and the field description says so in the editor's own terms.
**Revisit if:** the board asks to control the photographs individually — a caption per
picture, or a link out of one. That is a carousel, and it needs the machinery this
deliberately avoids.

## 037 — News gets program areas, photographs, and pages of its own
**Date:** 2026-08-25
**Decision:** `newsPost` gains a `program` reference and a `gallery`, and gets the same
shape of pages the events already have: `/news` for everything, `/news/<slug>` for an
article, and `/programs/<slug>/news` for one program's news. A program page shows its
three most recent articles and links to the rest.
**Why:** the board wanted somewhere for the things that are about FotVG's work but are not
events — a grant, a build, a thank you. The type existed and nothing rendered it.
**Why modeled on `event`:** an editor who has written up a concert already knows how this
works, and a maintainer reading one of the two schema files has read most of the other.
The article page is laid out like the second half of an event page, because that is what
it is: a short piece of writing with photographs under it.
**The boundary with event write-ups is unchanged and still matters.** News that is *about*
an event — how it went, how many came — belongs in that event's write-up. Adding
photographs to news makes the two look more alike, which is exactly why the rule is
restated in the schema. Two parallel histories of the same concert is the failure being
avoided.
**Why the filtered lists live under `/programs/<slug>/news` rather than `/news/<slug>`:**
they cannot share that shape. An article already owns `/news/six-new-raised-beds`, so
`/news/greenworks` would be ambiguous the day somebody writes an article whose headline
slugs to a program name. The events avoided this by splitting `/events/<slug>` from
`/past-events/<program>`; news nests instead, which keeps every article at a plain
`/news/…` address and still gives the board one address per program to put in a grant
application. It costs one inconsistency: the write-up filters and the news filters have
different URL shapes.
**Ordinary links, not a script,** exactly as decision 031 settled for the write-ups. The
`ProgramFilter` component now takes its addresses as props so both lists can use it.
**`programRecapCountsQuery` becomes `programCountsQuery`** and returns both counts. A
program with no articles gets no news link and no news page, so a filter can never lead
somewhere empty — and the first article for a program brings its page into existence on
the next build with nobody doing anything.
**News is in the header navigation,** conditional on there being any, which makes five
items. `SiteHeader` says it starts needing a menu at about five, so this is the last one
that fits without a rethink.
**No `archived` and no comparison against `now()`.** News has no life cycle: an article is
written, published, and becomes part of the record. `publishedAt` orders the list and does
nothing else, so an editor who mistypes a date gets an article in the wrong place rather
than one that has vanished.
**Not done:** news on the home page. That page is already long, and a "Latest news" block
would compete with "What we've done", which is the section built for grant reviewers.
**Revisit if:** news volume makes `/news` long enough to want paging, or the board wants
an article featured on the home page the way write-ups are (decision 029).

## 038 — Photographs are re-used through an unpublished draft, not a media library
**Date:** 2026-08-25
**Decision:** The way to build up a re-usable pool of photographs is an unpublished
document — a News post titled `Photo library — do not publish` — with the batch uploaded
into its Photographs field. Sanity's Media Library, which is the purpose-built answer,
is not available to FotVG and is not being pursued.
**Why anything was needed:** the board wanted to load photographs in after an event, while
permissions are fresh, and pick from them weeks later when somebody finally writes the
write-up. Re-use already worked — Sanity keeps every asset and any image field can pick
one that is already there — but there was no way to get a batch *in* before there was a
document to put it on.
**Why a draft works:** the site reads with `perspective: 'published'` and no token
(`src/lib/sanity.js`), so an unpublished document cannot reach the website even if a token
is added later. Alt text is `Rule.required()`, which blocks publishing rather than saving,
so a batch can go in unlabeled and be described at the point a picture is used.
**Why not Media Library:** it is a paid add-on on certain Enterprise plans and is not
self-serve. The organization record carries `mediaLibraryStatus: "enabled"`, which reads
like an entitlement and is not one — it describes what the platform supports, not what the
plan grants. `GET media-libraries?organizationId=…` returns an empty list, there is no
endpoint in any published API that creates a library, and Sanity's own assistant confirms
it needs a conversation with their sales team. **This is recorded because the flag is
misleading and cost an afternoon; the next person to read it should not spend another
one.**
**What it costs:** the asset browser searches filenames and nothing else, so the renaming
step in `docs/photos.md` is what makes the pool usable at all. And alt text, caption and
credit are stored per *use* rather than per file, so re-using a photograph still means
writing those again — the photographer credit in particular has already been got wrong
once on this project.
**Revisit if:** the nonprofit plan changes, Sanity makes Media Library self-serve, or the
photograph count gets large enough that filename search stops being enough — which is
probably somewhere north of a few hundred.

## 039 — The header links are sentence case, and Donate is the site button
**Date:** 2026-08-25
**Decision:** The four section links in the header drop the uppercase treatment for
sentence case at 1rem with a visible rule under each, and Donate becomes the site's
existing `.button` rather than a colored text link. The labels themselves are unchanged.
**Why:** the board said the top of the home page did not stand out and asked for more
emphasis. The cause was never contrast — the links were already 15.1:1. It was that
0.9rem capitals with 0.04em of letter spacing is the slowest setting there is to read at
a glance, and it was the smallest text on a site whose body copy has an 18px floor
*because* this audience skews older. Emphasis was being asked of a treatment that was
working against legibility.
**Why not boxes around all five:** that was the literal reading of "make them buttons"
and it was shown to the board alongside this. Five buttons means no button — it would
have made Donate less prominent, not more, on a site whose job is to earn a donation.
It also put outlines in the header that compete with the brass rules marking each
section further down.
**Why the shared `.button`:** one definition of what a button looks like, in one file.
It flips correctly on the dark band and in dark mode without this component knowing
anything about either. The header restates only its size — `.button` deliberately sets
no font-size so it can inherit the 18px body text it sits among in a section, and up
here there is no body text to agree with; inherited, it came out 58px tall next to 44px
links. `min-height: 48px` in global.css still holds the tap target.
**What it costs:** the header is 4px taller on a laptop and 8px on a phone, where the
nav now wraps to three rows rather than two. The nav itself is 29px *narrower* than
before, because sentence case at 1rem is more compact than spaced capitals — so the
point at which it drops below the wordmark has not moved. Sentence case in the header
also no longer matches the small capitals used for eyebrows elsewhere; that is
deliberate, and the board saw it before choosing.
**One thing this fixed on the way past:** the dark-mode block in `global.css` redefined
`--color-accent` to pale brass but never redefined `--color-on-accent`, so it kept light
mode's near-white. Every filled `.button` on the page background rendered at 1.9:1
against the 4.5:1 this site is held to, and the home page's "See everything we've done"
was live in that state. Buttons on `.band` were always fine — it sets its own. Adding a
button to the header would have put a second one in front of every dark-mode reader,
which is how it was noticed.
**Revisit if:** the navigation grows past five items, at which point the wrapping is
worth solving properly rather than absorbing — see the note in `SiteHeader.astro` about
a details/summary disclosure being cheaper than a script.

## 040 — `fotvg.org` is the canonical address, not `www.fotvg.org`
**Date:** 2026-08-29
**Decision:** The apex, `https://fotvg.org`, is the site's one address. `www.fotvg.org`
permanently redirects to it. `site:` in `astro.config.mjs` is set to the apex, and every
canonical URL, sitemap entry and Open Graph tag follows from that.
**Why:** It is what the organization already uses everywhere else — the mailboxes are
`@fotvg.org`, it is what is said aloud, and it is what a grant reviewer types from an
application. A site this small gains nothing from the alternative, and consistency
between the web address and the email domain is worth more than any of it.
**The argument against, and why it lost:** Netlify suggests `www` as primary when DNS is
external, because a `CNAME` follows them automatically while an apex `A` record pins the
site to one address (`75.2.60.5`). Real, but thin: that address has been stable for
years, and with a 600-second TTL a change is one record edit and ten minutes. Not worth
making every printed mention of the site two words longer.
**Tradeoff:** If Netlify ever moves that address, someone has to notice and edit the `A`
record. Written down here so that someone knows where to look.
**Revisit if:** never, realistically. Changing the canonical address after launch means
re-pointing every inbound link and reprinting anything that carries the old one.

## 041 — The prototype site keeps building after switchover
**Date:** 2026-08-29
**Decision:** `fotvg-webtest.netlify.app`, on John's personal Netlify account, is left
connected to `main` rather than deleted at switchover. Its deploy previews are turned
off, and the daily rebuild follows the build hook to FotVG's account.
**Why:** John's call. It costs little once previews are off — a build per merge rather
than a build per merge *plus* one per pull request *plus* one a day — and it keeps a
second working copy of the site while the new account is still new.
**Tradeoff, and the part to watch:** it serves the same content at a second public
address. With the disallow-all `robots.txt` now gone, both addresses are crawlable. What
stops that becoming duplicate content in search results is the canonical tag: every page
on the prototype declares `https://fotvg.org` as its real address (decision 040), which
is exactly what canonical tags are for. This works, but it depends on decision 040 —
if `site:` is ever pointed back at the prototype, the prototype starts claiming to be
the real site.
**Revisit if:** the prototype is ever wanted as a genuine staging environment, which
would mean pointing it at a branch other than `main` and a separate Sanity dataset. That
is a bigger change than it sounds and nobody has asked for it. Or simply delete it, which
is `SETUP.md` Phase 6 step 9 as originally written.

## 042 — Netlify access is a shared login, not team members, until the public-good plan lands
**Date:** 2026-08-29
**Decision:** FotVG's Netlify account is reached through the shared `tech@fotvg.org`
Google sign-in, which John and Catherine both use. No second team member is invited.
**Why:** Netlify's free plan allows one team member. Adding a second means paying per
seat, and FotVG has no budget for it. The shared mailbox is a genuine shared credential
rather than a workaround — both of them have their own phone registered against the
Google account, so each signs in as themselves and approves with their own device.
Nobody is passing a password around, and nobody is locked out if the other is away.
**What this costs, stated plainly:** no per-person audit trail. Netlify will record that
`tech@fotvg.org` changed a setting, not which of them did it. For a two-person volunteer
operation that is an acceptable trade; for a larger group it would not be.
**The route out is already on the checklist.** Netlify's open-source / public-good plan
is what buys real named members, so that application is now worth filing for its own
sake and not only for build credits.
**Note the asymmetry with GitHub.** GitHub organizations allow unlimited free members, so
there is no reason to share an account there — `tech@fotvg.org` gets a GitHub user
account of its own as a second *owner*, and it enrolls its own second factor because
GitHub does not accept Google sign-in. Same address, different mechanism.
**Revisit if:** the public-good plan is approved, or a third person needs access — at
which point a shared login stops being reasonable and starts being a liability.
