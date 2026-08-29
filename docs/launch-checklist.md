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
- [ ] **The home page photographs moved into `heroImages`,** and the old `heroImage` field
      then deleted from `studio/schemaTypes/siteSettings.ts`, along with its fallback in
      `src/lib/content.js` and its line in `siteSettingsQuery`. The old field is kept only
      so that deploying decision 036 could not blank the home page; once the board has
      saved Site settings with a photograph in the new field it is dead weight, and a
      deprecated field nobody removes is one a future maintainer has to work out.

## The Donate button

- [x] **Real Square URL in Site settings.** Done 29 August 2026, and a $1 test donation
      went through cleanly. The "Donate — link pending" placeholder no longer renders.
- [ ] 🚨 **Clear the program donation links until real Square links exist for them.**
      As of 29 August 2026 the *Donate — links to a particular program* entries all
      point at the **general** Square URL. That was the right way to prove the plumbing
      works; it is the wrong thing to launch. A donor who clicks "Greenworks" believes
      they have designated their gift, and in Square the treasurer sees an
      undifferentiated donation with no way to tell what it was for — the exact problem
      those per-program links exist to solve. For a 501(c)(3) that is a restricted-fund
      obligation FotVG cannot trace or evidence, and unlike a typo it cannot be
      corrected afterwards, because the money has already moved.
      The `programDonateLinks` field description in `studio/schemaTypes/siteSettings.ts`
      already says it: *add one here only when a matching link exists in Square.*
      Empty the field. The band drops the whole section cleanly when the list is empty.
      The treasurer then adds each entry as she creates its Square link, which is a
      better exercise than adding them all up front — she sees each one appear on the
      live site as she goes.
- [ ] Tax-deductibility wording confirmed with the board.
- [ ] Donation flow tested on an actual phone, not a desktop browser window.

## Accounts

- [x] **FotVG's own Netlify account exists** and the site is connected to this
      repository. Created 29 August 2026 on `tech@fotvg.org` via Google sign-in; team
      **FotVG**, project **fotvg** at `fotvg.netlify.app`. The prototype stays on John's
      personal account and keeps building (decisions 015 and 041).
- [ ] ⚠️ **Netlify project visibility set to Public.** New projects are created
      **Private** — visible only to logged-in team members. Useful before launch, and a
      login wall in front of every visitor after it. Flip it as part of the cutover and
      prove it in a private browsing window. See `docs/dns-cutover.md`.
- [ ] ⚠️ **Netlify open-source / public-good application filed and approved.** This
      matters for more than build credits now. Netlify's free plan allows **one team
      member**, so a second person cannot be added without paying per seat — which
      FotVG has no budget for. The public-good plan is the only route to real,
      individually-named team members. Until it lands, Netlify access is the shared
      `tech@fotvg.org` login (decision 042), which works but gives no per-person audit
      trail. Also check the build allowance against about 32 builds a month.
- [x] **Sanity nonprofit plan approved** and set up, 29 August 2026. The quota cliff on
      the free plan — at 100% the public API stops serving and content vanishes from the
      live site — no longer applies.
- [ ] 🚨 **`fotvg.org` renewed, and auto-renew turned on.** Renewal falls on **3
      September 2026** and auto-renew is not shown as on. If the registration lapses the
      website and every `@fotvg.org` mailbox go down together. Catherine pays it. **This
      gates the switchover** — see `docs/dns-cutover.md`.
- [ ] 🚨 **A second owner on the GitHub organization.** As of 29 August 2026
      `friends-of-the-village-green` has exactly one member and one owner: John. The
      repository *is* the asset — the whole design premise is that the repo plus a short
      config list can rebuild the site from nothing — so a single owner is the sharpest
      single point of failure on the project, sharper than any hosting account.
      Invite **`tech@fotvg.org`** as an **Owner** (not a member): it is a shared mailbox
      that Catherine and John both reach, so access travels with the role rather than
      the person, which is the same reasoning used for the Studio invitations.
      Two things to get right when doing it. A GitHub *user* account must exist on that
      address to accept the invitation — an organization cannot own another
      organization. And **GitHub's two-factor is not Google's.** The Google account on
      `tech@fotvg.org` already works as a shared login because both John's and
      Catherine's phones are registered against it and whoever signs in picks their own
      number. None of that carries over: GitHub does not accept Google sign-in for
      personal accounts, so a GitHub account on that address enrolls its own second
      factor. Register **both** phones as passkeys, or put the TOTP seed in the password
      vault. A shared account whose second factor reaches only one person is not shared.
- [ ] Two people can get into every account. Password vault current.

## The switchover itself ⚠️

The full procedure, with the zone as it stood in August 2026 and the rollback, is in
`docs/dns-cutover.md`. Read that before starting. The boxes below are the summary.

- [ ] **Record the full DNS zone before touching anything.** Screenshot it into
      `docs/hosting.md`.
- [ ] **Confirm the MX records and preserve them.** FotVG's email runs on Google
      Workspace through this domain. Changing nameservers without carrying the MX records
      across breaks the organization's email. This is the single most damaging mistake
      available on this project.
- [x] `site:` in `astro.config.mjs` changed to `https://fotvg.org` — the apex, not `www`
      (decision 040). Canonical URLs, the sitemap and every Open Graph tag derive from it.
- [x] **`public/robots.txt` disallow-all removed**, replaced with an allow-all naming the
      sitemap. The disallow existed to keep the prototype out of search results; leaving
      it would have kept the real site out too.
- [ ] **Merge the switchover branch on cutover morning, before changing DNS** — not
      before. Both changes above are made but neither takes effect until a build runs,
      and merging early would have the prototype advertising canonical URLs at a domain
      that does not resolve yet. Merge first, let both sites build, then change DNS.
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
- [ ] **Favicon redrawn in the new display face.** `public/favicon.svg` still sets the
      abbreviation in Georgia, from when the site was serif — the board changed the
      display face to Trebuchet on 12 August 2026 (decision 026), so the tab icon and
      the site now disagree. Needs the SVG changed *and* `favicon.ico` and
      `apple-touch-icon.png` regenerated from it, which needs a tool this machine does
      not have — no ImageMagick, Inkscape or rsvg-convert. Changing only the SVG makes
      it worse, not better.

## Handover

- [ ] `docs/runbook.md` complete, including the "Who to contact" section.
- [ ] A dataset backup has actually been taken and a restore tried at least once.
- [ ] Both editors have published something themselves, unaided.
- [ ] Someone other than John knows this document exists.
