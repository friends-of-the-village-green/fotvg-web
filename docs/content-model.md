# Content model

The Sanity schema, in plain language. Keep this in sync with `studio/schemaTypes/`.

## siteSettings (singleton)
Organization name, contact email, donate URL, social links, default share image.
There is only ever one of these.

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
image + alt, signup URL (optional), cancelled flag.

Fields — *after*: recap (rich text), gallery (array of images, each with alt text,
optional caption, and photographer credit).

The presence of recap content is what marks an event as written up. Past events with a
recap are the site's evidence of delivery — the board uses them in grant applications,
so they get a durable URL and stay published indefinitely.

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
Fields: name, role, bio (short), photo + alt.
Only include people who have agreed to appear.

---

**Adding a type is a decision, not a detail.** Record it in `docs/decisions.md` with the
reason, and update this file.
