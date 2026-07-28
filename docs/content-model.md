# Content model

The Sanity schema, in plain language. Keep this in sync with `studio/schemaTypes/`.

## siteSettings (singleton)
Organization name, contact email, donate URL, social links, default share image.
There is only ever one of these.

## page
Standing pages that change rarely: About, What We Do, Get Involved, Contact.
Fields: title, slug, summary, body (rich text), hero image + alt, SEO description.

## event
Work parties, plant sales, talks.
Fields: title, slug, startDate, endDate, location, summary, body, image + alt,
signup URL (optional), cancelled flag.
Dates are stored as datetime and always displayed in America/Los_Angeles.

## newsPost
Short updates and event recaps.
Fields: title, slug, publishedAt, summary, body, image + alt.

## person
Board members and named volunteers.
Fields: name, role, bio (short), photo + alt.
Only include people who have agreed to appear.

---

**Adding a type is a decision, not a detail.** Record it in `docs/decisions.md` with the
reason, and update this file.
