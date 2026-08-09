---
name: sanity-content-model
description: Conventions for FotVG's Sanity schema, GROQ queries, image handling, and Studio configuration. Use this skill whenever touching anything in studio/, writing or modifying a GROQ query, adding or changing a document type or field, rendering Portable Text, working with Sanity images, or wiring content into Astro pages. Also use it when the user asks to "add a content type", "let editors change X", or anything that implies the editing interface. If the change affects what an editor sees in the Studio, this skill applies.
---

# FotVG Sanity Conventions

## The governing principle

Every document type and every field is something a non-technical volunteer will see and
have to understand — and something a future maintainer will have to migrate. The schema
should be as small as it can be while doing the job.

Before adding a document type, ask: could this be a field on an existing type? Before
adding a field, ask: will an editor know what to put in it without being told?

## Current document types

Keep this list current. If you add a type, update `docs/content-model.md` too.

| Type | Purpose | Roughly how many |
|---|---|---|
| `siteSettings` | Singleton. Org name, contact email, social links, donate URL | 1 |
| `page` | Standing pages: About, What We Do, Donate, Contact | 5–10 |
| `event` | Concerts, luncheons, lectures, work parties, garden tours, sales | Ongoing |
| `newsPost` | Short updates and recaps | Ongoing |
| `person` | Board members and named volunteers | ~10 |

Do not add types beyond this without discussing it. In particular, resist: categories,
tags, taxonomies, reusable content blocks, and page builders. Each one multiplies the
editor's decisions and the maintainer's burden.

## Schema authoring rules

**Every field gets a `title` and a `description`.** The description is the only
instruction the editor gets. Write it as guidance, not as a restatement of the name.

```js
defineField({
  name: 'summary',
  title: 'Short summary',
  type: 'text',
  rows: 3,
  description:
    'One or two sentences shown in event listings and search results. ' +
    'Aim for under 160 characters — longer text gets cut off.',
  validation: (Rule) => Rule.required().max(200),
})
```

**Validate rather than hope.** Required fields should be `Rule.required()`. Lengths that
matter to layout should be capped. Dates that must be in order should be checked. An
editor who gets an inline error learns the rule; an editor who publishes a broken page
does not.

**Use `slug` with a source.** Auto-generate from the title so editors never hand-write
URLs.

**Prefer explicit fields over free-form Portable Text** where the content is structured.
An event's date, time, and location are fields, not sentences buried in a rich text
body. This is what makes the site able to sort, filter, and display them properly.

**Configure `preview`** on every type so the Studio's document lists are readable. An
editor scanning a list of thirty events needs to see date and title, not "Untitled."

**Order fields the way an editor thinks**, not the way the data model is shaped: title,
then the thing they came to change, then optional extras, then SEO at the bottom.

## Dates

Store event dates as `datetime`. Set `options: { dateFormat: 'YYYY-MM-DD', timeFormat:
'h:mm a' }` so the Studio shows something familiar.

Everything on this site is in `America/Los_Angeles`. Format dates for display in that
timezone explicitly — do not rely on the build server's locale, which will be UTC and
will silently show the wrong day for evening events. This is the single most common bug
in this kind of site.

For multi-day or recurring events, use explicit `startDate` and `endDate` fields rather
than trying to model recurrence rules. A volunteer creating three copies of a work party
is fine; a recurrence engine nobody understands is not.

## GROQ queries

Keep queries in `src/lib/queries.js`, named and exported. Do not scatter inline GROQ
through page components — a future maintainer needs one place to look.

Project only the fields you use. Fetching whole documents wastes bandwidth against a
metered quota and makes it unclear what a page actually depends on.

```js
export const upcomingEventsQuery = `
  *[_type == "event" && defined(slug.current) && startDate >= now()]
  | order(startDate asc) {
    _id, title, "slug": slug.current, startDate, endDate, location, summary,
    "image": image{ asset->{ _id, url }, alt, hotspot, crop }
  }
`
```

Always guard against unpublished and draft documents. Use the CDN-backed client
(`useCdn: true`) for production builds; drafts require a token and should not appear on
the public site.

## Images

Use `@sanity/image-url` to build URLs. Never hardcode a Sanity CDN URL, and never
reference `asset.url` directly for display — you lose the transformation pipeline,
hotspot cropping, and format negotiation that are the main reason to be on Sanity at all.

```js
import imageUrlBuilder from '@sanity/image-url'
const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)

// usage
urlFor(image).width(800).height(450).fit('crop').auto('format').url()
```

Always request `auto('format')` so modern browsers get WebP/AVIF. Always set explicit
`width` and `height` attributes on the `<img>` to prevent layout shift. Always provide
responsive `srcset` for anything wider than a thumbnail — volunteer photos are often
4000px originals and serving those to phones will burn the bandwidth quota.

**Every image field must have a paired `alt` field marked required.** Editors will skip
it otherwise, and the accessibility debt compounds silently.

## Portable Text

Restrict the block content type to what the design actually supports: normal, h2, h3,
bullet list, numbered list, bold, italic, link. Do not enable h1 (the page supplies
that), and do not enable colour, font, or alignment controls — they let editors produce
pages the design cannot render and that fail contrast checks.

Render with `astro-portabletext` or a small custom serializer. Handle the case where the
field is empty or missing; a half-filled draft should degrade, not crash the build.

## Studio configuration

- The Studio lives in `studio/` and deploys to Sanity's own hosting via `npx sanity
  deploy`, giving editors a stable URL. It is deliberately **not** built and served by
  Netlify — that would consume deploy credits and couple editing to site deploys.
- Use a structure builder configuration to make `siteSettings` a singleton, so editors
  cannot accidentally create a second one.
- Group document types in the Studio sidebar in the order editors use them: Events
  first, then News, then Pages, then Settings.

## Safety

- **Never run a script that mutates or deletes documents** without asking first and
  confirming a recent `sanity dataset export` exists.
- **Never put a write token in the Astro site.** The site is read-only against Sanity.
- Read tokens for the build go in Netlify's environment variables, not in the repo.
- Before any schema change that renames or removes a field, say plainly what will happen
  to existing content and whether a migration script is needed.
