# FotVG Website — you are working in fotvg-web

Write the abbreviation as **FotVG** — that is the organization's own usage throughout
its documents. Not FOTVG, not FOTVG.org.

## What this is

The public website for **Friends of the Village Green (FotVG)**, a small volunteer
501(c)(3) in Kingston, Washington.

FotVG is a *friends-of* organization. It is **all-volunteer**, it was founded in 2025,
and it supports **some** of the programs and people at the **Village Green Community
Center** — three areas today: the Village Green Arts Program, Greenworks, and Community
building. It does not own the building or the land, it does not run the Community
Center, and plenty happens there that it has no hand in. Read `docs/organization.md`
before writing any copy about who FotVG is; three separate organizations share the
"Village Green" name and conflating them is the easiest mistake to make on this project.

The site exists to:

1. Explain what FotVG is and what it supports, clearly enough to earn a donation.
2. Publicize upcoming events and programs.
3. **Show what past events actually looked like** — photos and a short write-up.
   This is not decoration: the board uses it as evidence of delivery when applying for
   grants.
4. Take donations, via an external Square link.

All content is public. There is no login, no gated content, and no e-commerce.

## Who this is for

Three audiences, in priority order:

1. **Local community members** who want to know what's happening at the Village Green
   and when — often on a phone, often in a hurry.
2. **Potential donors and volunteers** who need to understand quickly what FotVG does
   and why it matters before they give money or time.
3. **Grant makers** checking whether this organization delivers what it says it will.
   They arrive from an application, look for evidence, and leave.

Assume readers are not technical and are skimming. Many are older; text size, contrast,
and tap-target size matter more here than on a typical site.

## The constraint that shapes every decision

FotVG has **one technically capable volunteer**. When that person steps back, whatever
is left must still be maintainable — or at minimum, must not silently break.

This means:

- Prefer boring, well-documented technology over clever technology.
- Prefer fewer moving parts over more capable ones.
- Every non-obvious decision goes in `docs/decisions.md` with the reasoning.
- Anything a volunteer has to do routinely gets a written procedure in `docs/runbook.md`.

When you are weighing two approaches and one is simpler but slightly less capable,
choose the simpler one and note the tradeoff. Do not add a dependency, a service, or a
build step without saying out loud what it costs in long-term maintenance.

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Site framework | Astro | Static output. No SSR unless there's a compelling reason. |
| Content | Sanity (nonprofit plan) | Studio lives in `studio/`, deployed to Sanity's own hosting |
| Hosting | Netlify | Free/public-good plan — deploy budget is constrained, see below |
| Forms | Netlify Forms | Honeypot + spam filtering required |
| Donations | External Square link | Square is already FotVG's card processor. No card data ever touches this site |
| Images | Sanity asset pipeline | Use `@sanity/image-url`, never raw asset URLs |

## Hard rules

These are not style preferences. Violating them causes real damage.

- **Never commit secrets.** No tokens, API keys, dataset write tokens, or `.env` files.
  If you need a value at build time, it goes in Netlify's environment variables UI and
  is referenced by name. `.env.example` documents the names only.
- **Never deploy to production directly.** Production deploys happen by merging to
  `main`, which Netlify builds automatically. Do not run `netlify deploy --prod`.
  Draft deploys and deploy previews are fine.
- **Never use a Sanity write token in site code.** The site reads content. Writing
  happens in the Studio, by humans.
- **Never delete or mutate Sanity documents from a script** without explicitly asking
  first and confirming a dataset export exists.
- **Do not add npm dependencies casually.** Each one is a future upgrade obligation for
  a volunteer organization. Ask before adding anything that isn't clearly load-bearing.
- **Never publish a board member's home address.** Several appear in the source
  documents — as the registered agent address and as meeting venues. The public contact
  address is the Village Green Community Center. See `docs/organization.md`.
- **Never publish a photo without confirmed permission**, and never publish one
  containing identifiable children without explicit written board confirmation. See
  `docs/photos.md`.
- **Write American English.** Spelling, vocabulary, and idiom, in everything readers
  see — page copy, alt text, button labels, error messages, meta descriptions. The board
  noticed British phrasing in the August 2026 mock-ups and asked for it to stop. Common
  slips on this project: *neighbours, colour, programme, centre, grey, levelling,
  publicise, organise, autumn* (prefer **fall**), *at half past six* (prefer **six
  thirty**), *rather the point*, *a good deal of*. Note the exception: the HTML attribute
  `aria-labelledby` is spelled that way by the spec — never "correct" it.

## Deploy budget — read this before automating anything

Netlify's free plan is credit-metered, and deploys consume credits. A rebuild on every
content change will exhaust the monthly allowance and **suspend the site for the rest of
the calendar month**. That is an unacceptable failure mode for a public-facing org site.

Therefore:

- Content publishes are **batched**. The Sanity webhook triggers at most one build per
  day, or is replaced by a scheduled daily build.
- Deploy previews are enabled for pull requests but should not be generated for trivial
  content-only commits.
- Before adding any automation that triggers builds, state how many builds per month it
  will cause.

Check current usage under Netlify → Billing → Usage before assuming there's headroom.

## Workflow

1. Work happens on a branch, never directly on `main`.
2. Open a PR. Netlify generates a deploy preview.
3. Human reviews the preview URL.
4. Merge to `main` → production build.

Step 1 is enforced, not just asked for: `main` carries a GitHub ruleset requiring a pull
request, blocking force pushes and restricting deletions, with no bypass for anyone
including the repository owner (decision 035). A direct push to `main` is rejected by
GitHub. If one is refused, that is the rule working — open a branch, not a workaround.

Local development: `npm run dev` for the site, `npm run studio` for the Sanity Studio.

## Content model

Content types live in `studio/schemaTypes/`. The current set is documented in
`docs/content-model.md`. Keep the schema **small**. Every document type is something a
future maintainer has to understand. If a piece of content can reasonably be a field on
an existing type rather than a new type, make it a field.

Prose that changes once or twice a year (About, Mission, History) may live as markdown
in `src/content/` rather than in Sanity. Sanity is for content that changes often —
primarily events, event recaps, and photos.

An event has a life cycle here: it is announced, it happens, and then it is written up
with photos. The recap is the part the board cares most about, because it is what a
grant reviewer reads. Design the event type so a recap is a natural continuation of the
same document, not a separate thing an editor has to remember to create.

## Voice

FotVG is an all-volunteer group of neighbors helping pay for some of what happens at a
much-loved community center — the arts program, the community garden, and community
projects like the Secret Garden Tour. Write like that: plain, warm, specific, unhurried.
Not corporate, not breathless, not marketing-voice.

Two things to keep straight, both corrected by the board in August 2026:

- FotVG supports **some** programs. It does not run or fund everything at the Village
  Green, and copy must never imply otherwise.
- It is **all-volunteer** and **new** — founded in 2025, only a few months old. Say both
  plainly rather than leaving them to be inferred.

The recurring value words in their own writing are **welcoming**, **all ages and
abilities**, **free or low-cost**, **barrier-free**, **intergenerational**, and
**inclusive**. Use them because they are true, not as decoration.

See the `fotvg-brand` skill for the full guidance before drafting any user-facing copy.

## Accessibility

WCAG 2.2 AA is the floor, not the goal. Public-facing nonprofit sites attract
accessibility complaints, and remediation costs far more than building it right.
Run the `accessibility` skill's checklist before any PR that changes markup or styling.

## Things that are explicitly out of scope

Do not build these unless the scope changes and `docs/decisions.md` is updated:

- User accounts, logins, or member-only content
- A blog with a heavy tagging/taxonomy system
- Anything requiring a database or server-side session
- Newsletter management (use an embedded third-party form)
- Payment processing implemented in-house

**"Membership" is not a thing here.** FotVG's bylaws state the corporation has no
members. Never write "become a member" or "join FotVG". The calls to action are
**Donate**, **Volunteer**, and **Come along**.

## Where to look

- `docs/organization.md` — who FotVG is, who the other Village Green entities are, and
  what the programs actually are. **Read before writing any user-facing copy.**
- `docs/decisions.md` — why things are the way they are. Read this before proposing
  architectural changes.
- `docs/photos.md` — how volunteer photos get from a board member's phone to the site,
  and the permission rules that gate that.
- `docs/runbook.md` — operational procedures (deploy, rollback, backup, restore).
- `docs/content-model.md` — the Sanity schema and what each field is for.
- `docs/hosting.md` — account ownership, plan tiers, DNS, who holds what credential.
- `docs/launch-checklist.md` — everything that must be true before `fotvg.org` points
  here. Add to it whenever you leave something for later.

## Source material

FotVG's Google Drive is mirrored locally at `../fotvg-drive-folders`, and photo batches
from board members at `../fotvg-photos`. Both are **read-only reference**. Read them for
context; never copy files into this repo except as deliberately curated content. They
contain bank statements, insurance policies, personal addresses, and board
deliberations — none of which belong on a website.
