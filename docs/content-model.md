# Content model

The Sanity schema, in plain language. Keep this in sync with `studio/schemaTypes/`.

## siteSettings (singleton)
There is only ever one of these. Four tabs in the Studio — the first two are the words
on the home page, in the order they appear on it; the other two are the organization's
own details.

- **Home page**, in three collapsible boxes:
  - *The top of the page* — `heroEyebrow`, `heroHeading`, `heroLede`, `heroImage`
  - *What we support — the closing note* — `supportMoreHeading`, `supportMoreText`
  - *Three organizations share the name* — `disambiguationHeading`, `disambiguationText`
- **Donate and volunteer** — `donateHeading`, `donateText`, `donateFeeText`,
  `donateUrl`, `programDonateLinks`, `donateByCheck`, `volunteerHeading`,
  `volunteerText`. The green band, and the fields are in the order they appear in it.
  The tax note is **not** here: a statement of corporate status is not copy.

  `donateFeeText` is the invitation to cover the card fee and `donateByCheck` is the
  alternative for anyone who would rather not use a card — each its own field rather
  than another paragraph of `donateText`, so that rewriting the appeal cannot quietly
  delete either. Decision 028.

  `programDonateLinks` is a list of {program, Square link} pairs, shown as small links
  under the Donate button. Each entry needs its **own** donation link in Square — that
  is the whole point, because a link's title is what tells the treasurer which fund a
  payment belongs to. Adding an entry that points at the general link would silently
  merge the funds. Decision 028, and the procedure is in `docs/runbook.md`.
- **Organization and contact** — organization name, tagline, public email, postal
  address, social links.
- **Sharing** — the default link-preview image.

**Every one of those text fields falls back to the copy in the template when it is
empty**, so clearing one restores the original wording rather than blanking the page.
Decisions 023 and 027.

### simpleText
The shared type behind every one of those prose fields: Portable Text allowing normal
paragraphs and **bold**, and nothing else. Not `blockContent`, which is still right for
the long-form body of an event, program or page.

The restriction is the point. These blocks sit inside a fixed design rather than flowing
down a page, and every control `blockContent` offers would break one: a heading inside
the green band competes with the band's own heading, a bulleted list blows out the
two-column grid, a link sits next to a button that is already the call to action. Bold
survives because it earns its place — it is what lets an editor put weight on
"all-volunteer" without asking a developer.

### The one field to be careful with
`disambiguationText` is the only field on this site where an edit can say something
untrue about **another organization**. The Metropolitan Park District owns the land, the
Village Green Foundation owns the building, and FotVG supports some of the programs and
the people who run them. See `docs/organization.md`; the Studio field carries the
warning too.

### What is deliberately *not* a program
`supportMoreHeading` / `supportMoreText` render the closing card under "What we support"
— "And, we hope, more". It sits in the same grid as the program areas but is not one:
no slug, no page, no link, and nothing an event can be attributed to. It must not be
created as a `program` document. See decision 027.

## page
Standing pages that change rarely: About, What We Do, Get Involved, Contact.
Fields: title, slug, summary, body (rich text), hero image + alt, SEO description.

## event
Concerts, garden tours, Greenworks classes and workshops, garden work parties, rummage
sales. Not senior luncheons and not Village Green Woods trail work — FotVG neither runs
nor funds those (see `docs/organization.md`).

An event has **two phases in one document**: the announcement before it happens, and the
recap afterwards. They are not separate document types. An editor writing up last
Saturday's concert opens the event they already created and fills in the bottom half —
they do not have to remember to create a second thing and link it up.

Fields — *before*: title, slug, startDate, endDate, location, summary, body,
image + alt, signup URL (optional), `cancelled`, `archived`.

Fields — *after*: recap (rich text), gallery (array of images, each with alt text,
optional caption, and photographer credit), `featuredOnHome`.

The presence of recap content is what marks an event as written up. Past events with a
recap are the site's evidence of delivery — the board uses them in grant applications,
so they get a durable URL and stay published indefinitely.

### The three checkboxes, and what each one does
- **`cancelled`** — the event keeps its page and its row, and both say plainly that it
  is cancelled. For someone holding a flyer, that is the single most useful thing the
  site can tell them.
- **`archived`** — the event vanishes from the site entirely, its own page included, and
  stays in the Studio to be copied from. This is the alternative to deleting, which
  cannot be undone. Untick it and everything returns at the same URL. Decision 030.
- **`featuredOnHome`** — puts a write-up on the home page under "What we've done". With
  none ticked the home page falls back to the three most recent write-ups, so the
  section can never render empty. Decision 029.

`archived` sits on the *before* tab next to `cancelled` rather than with the write-up,
even though archiving happens years later: they are the same kind of switch, and that is
the tab that opens by default.

Every event query in `src/lib/queries.js` is built on a shared `LIVE_EVENT` filter that
excludes archived events. Write `archived != true`, never `!archived` — see the comment
on that constant, and decision 030.

Dates are stored as datetime and always displayed in America/Los_Angeles.

**Program** is a reference field on event, pointing at a `program` document. Still not a
navigation concept — see decision 011.

## program
The three areas FotVG supports: Village Green Arts Program, Greenworks, Community
building. Exactly three today; the board expects to add more.

Fields: name, slug, summary, mission, vision, body (rich text), hero image + alt,
accent color token, SEO description.

Each gets its own page. Where an event displays its program attribution — "Music at the
Green · Village Green Arts Program" — that text links here. Greenworks' mission and
vision wording is already settled and sits in `docs/organization.md`; use it verbatim.

This is a new document type rather than an enum because the values now need pages,
slugs, and prose of their own. Recorded as decision 011.

## newsPost
Short updates that are not tied to an event.
Fields: title, slug, publishedAt, summary, body, image + alt.

If a piece of news *is* about an event, it belongs in that event's recap instead.

## person
Board members and named volunteers.
Fields: name, role, bio (short), photo, order (to put officers first).
Only include people who have agreed to appear.

---

## Shared objects

Not document types — building blocks the types above reuse.

**`blockContent`** is the rich text field. Deliberately small: paragraphs, two heading
levels, bulleted and numbered lists, bold, italic, link. No color, no font size, no
alignment, no h1. Those controls let an editor produce a page the design cannot render
or that fails a contrast check, and neither failure is visible to the person who caused
it.

The two heading styles are labeled **Heading 2** (`h2`) and **Heading 3** (`h3`) — the
numbers, not "Heading" and "Subheading", because the page's own title is Heading 1 and
the old names gave no clue which of the two outranked the other. The Studio previews h2
far larger than the 32px the site renders it at, so an editor sizing by eye reaches for
the wrong one; a number survives a misleading preview. Every field using `blockContent`
repeats the same sentence about it, from the exported `HEADING_GUIDANCE` constant.
Decision 034.

**`figure`** is a photograph: the image, plus **alt text (required)**, an optional
caption, and the photographer's name. Alt text is required everywhere with no exception —
when it is optional, editors skip it and the accessibility debt builds silently.

---

**Adding a type is a decision, not a detail.** Record it in `docs/decisions.md` with the
reason, and update this file.
