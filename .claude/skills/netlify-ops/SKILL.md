---
name: netlify-ops
description: Deploy workflow, environment variables, build-credit discipline, rollback, and DNS for the FOTVG site on Netlify. Use this skill whenever the task involves deploying, build failures, environment variables or secrets, build hooks, webhooks from Sanity, redirects, headers, custom domains, or anything that could trigger a production build. Also use it before adding any automation that causes builds. If the word "deploy", "publish", "live", or "production" appears in the request, read this first.
---

# Netlify Operations — FOTVG

## Deploy model

**Production deploys happen by merging to `main`.** Netlify watches the repository and
builds automatically. That is the entire production deploy mechanism.

Do not run `netlify deploy --prod`. Do not deploy from a local machine to production.
The reason is not ceremony: git history is the record of what is live, and a CLI deploy
from someone's laptop breaks that correspondence in a way that is very hard to debug
six months later.

Acceptable CLI use:
- `netlify dev` — local development with Netlify's environment
- `netlify deploy` — a **draft** deploy to a unique URL, for sharing a preview
- `netlify build` — test the build locally
- `netlify env:list` — see which variables are set (names only; do not print values)
- `netlify logs:deploy` — investigate a failed build

## Build credits — the constraint that governs automation

The free/public-good plan meters builds. Exceeding the monthly allowance suspends the
site for the remainder of the calendar month. For a public-facing community site with
event listings, that is a serious failure.

**Before adding anything that triggers a build, state how many builds per month it will
cause.** This includes Sanity webhooks, scheduled functions, GitHub Actions, and cron.

Rules:
- The Sanity webhook fires at most one build per day. Configure it as a batched or
  scheduled trigger, not per-document-publish.
- Do not enable deploy previews on content-only commits. Reserve them for code changes
  that need review.
- Turn off automatic branch deploys for anything except `main` and open PRs.
- Check Netlify → Billing → Usage before assuming there is headroom.

If usage is trending toward the cap, the first lever is reducing build frequency, not
upgrading the plan — FOTVG has no budget.

## Secrets and environment variables

Environment variables are set in the **Netlify UI** (Site configuration → Environment
variables). They are never committed, never printed, and never pasted into chat.

`.env.example` in the repo documents the *names* and what each is for:

```
PUBLIC_SANITY_PROJECT_ID=      # not secret, safe to expose
PUBLIC_SANITY_DATASET=         # "production"
SANITY_API_READ_TOKEN=         # secret. Viewer scope only. Never a write token.
```

Variables prefixed `PUBLIC_` are exposed to the browser by Astro. Anything not intended
for the browser must not carry that prefix. Before adding a variable, decide which side
of that line it belongs on and say so.

If a token is ever committed by accident: rotate it in Sanity/Netlify immediately, then
worry about scrubbing git history. Rotation is the fix; history rewriting is cleanup.

## When the build fails

1. Read the deploy log in the Netlify UI, or `netlify logs:deploy`
2. Reproduce locally with `netlify build` — most failures are reproducible
3. Common causes, in rough order of likelihood:
   - A missing environment variable (works locally because it's in your `.env`)
   - Node version mismatch — pin it in `.nvmrc` and `netlify.toml`
   - A Sanity query returning null for a document an editor unpublished
   - A required Sanity field that's empty on a draft-turned-published document
4. **The site stays up.** A failed build does not take down the previous deploy. Do not
   panic-deploy; fix it properly.

Guard against cause 3 and 4 in code: a missing image or empty field should render
gracefully, not throw. An editor should never be able to break the build by leaving a
field blank.

## Rollback

Netlify keeps every deploy. To roll back: Deploys → select the last good deploy →
"Publish deploy." This is instant and does not require a rebuild.

Then fix forward in git. Do not leave production pinned to an old deploy for long —
it desynchronizes `main` from what's live, which is exactly the confusion to avoid.

## netlify.toml

Keep configuration in the repo, not only in the UI, so it is reviewable and restorable:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/donate"
  to = "https://<donation-platform-url>"
  status = 302
  force = true
```

Redirects belong here too. When a URL changes, add a 301 from the old path — community
sites accumulate links in printed flyers and old Facebook posts that must keep working.

## Forms

Form submissions are handled by Netlify and appear in the UI under Forms. Configure:
- Spam filtering on
- A honeypot field in the markup
- Email notification to FOTVG's role address, not an individual's personal inbox

Check the current plan's form handling terms before assuming unlimited submissions.

## DNS

The domain may be registered anywhere; only DNS needs to point at Netlify. Prefer
pointing DNS at Netlify while leaving registration where it is, unless there is a reason
to move it.

Before any DNS change: record the current records somewhere retrievable, confirm who
owns the registrar account, and check whether MX records are in play. **Changing
nameservers without preserving MX records will break the organization's email.** This
is the single most damaging mistake available in this project — confirm before acting.

## What requires a human

Ask before doing any of these, even if the task seems to imply them:
- Anything that changes DNS
- Anything that changes the production domain or SSL configuration
- Changing the plan or billing settings
- Deleting a site, a deploy, or form submissions
- Adding a collaborator or changing team permissions
