# FOTVG Website — Project Memory

## What this is

The public website for **Friends of the Village Green (FOTVG)**, a small volunteer
nonprofit in Kingston, Washington. The site exists to build awareness of what the
organization does, publicise upcoming events and work parties, and accept donations.

All content is public. There is no member login, no gated content, and no e-commerce.

## Who this is for

Two audiences, in priority order:

1. **Local community members** who want to know what's happening at the Village Green
   and when — often on a phone, often in a hurry.
2. **Potential donors and volunteers** who need to understand quickly what FOTVG does
   and why it matters before they give money or time.

Assume readers are not gardeners, not technical, and skimming. Many are older; text
size, contrast, and tap-target size matter more here than on a typical site.

## The constraint that shapes every decision

FOTVG has **one technically capable volunteer**. When that person steps back, whatever
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
| Search | Pagefind | Static index built at build time |
| Donations | External payment link | No card data ever touches this site |
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

Local development: `npm run dev` for the site, `npm run studio` for the Sanity Studio.

## Content model

Content types live in `studio/schemaTypes/`. The current set is documented in
`docs/content-model.md`. Keep the schema **small**. Every document type is something a
future maintainer has to understand. If a piece of content can reasonably be a field on
an existing type rather than a new type, make it a field.

Prose that changes once or twice a year (About, Mission, History) may live as markdown
in `src/content/` rather than in Sanity. Sanity is for content that changes often —
primarily events and news.

## Voice

FOTVG is a group of neighbours who look after a shared green space. Write like that:
plain, warm, specific, unhurried. Not corporate, not breathless, not marketing-voice.

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

## Where to look

- `docs/decisions.md` — why things are the way they are. Read this before proposing
  architectural changes.
- `docs/runbook.md` — operational procedures (deploy, rollback, backup, restore).
- `docs/content-model.md` — the Sanity schema and what each field is for.
- `docs/hosting.md` — account ownership, plan tiers, DNS, who holds what credential.
