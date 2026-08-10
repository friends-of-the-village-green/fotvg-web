/**
 * Every GROQ query on this site, in one file.
 *
 * Keeping them here rather than inline in components means a future maintainer
 * has one place to look when they need to know what the site reads from Sanity.
 *
 * Project only the fields a page actually uses. Fetching whole documents wastes
 * bandwidth against a metered quota and hides what a page really depends on.
 */

/* Reused image projection. `asset->` resolves the reference so the image URL
   builder has something to work with; hotspot and crop carry the editor's
   framing choices through. */
const IMAGE = `{
  asset->{_id, url, metadata{dimensions, lqip}},
  alt, caption, credit, hotspot, crop
}`

/* ---------------------------------------------------------------- settings */

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0]{
    organizationName, tagline, contactEmail, postalAddress, donateUrl,
    socialLinks[]{platform, url},
    "shareImage": shareImage${IMAGE}
  }
`

/* ---------------------------------------------------------------- programs */

export const allProgramsQuery = `
  *[_type == "program" && defined(slug.current)] | order(name asc){
    _id, name, "slug": slug.current, summary,
    "image": image${IMAGE}
  }
`

export const programBySlugQuery = `
  *[_type == "program" && slug.current == $slug][0]{
    _id, name, "slug": slug.current, summary, mission, vision, body,
    seoDescription,
    "image": image${IMAGE}
  }
`

/* ------------------------------------------------------------------ events */

/* Shared shape for an event in a list. */
const EVENT_CARD = `
  _id, title, "slug": slug.current, startDate, endDate, location, summary,
  cancelled,
  "program": program->{name, "slug": slug.current},
  "image": image${IMAGE}
`

/**
 * Upcoming events.
 *
 * Compares against `endDate` where there is one, so an all-day event stays in
 * the upcoming list until it is genuinely over rather than dropping off at
 * midnight. `now()` is evaluated by Sanity at query time — which is build
 * time, so the listing is only as fresh as the last build. That is why there
 * is a scheduled daily build (decision 005).
 */
export const upcomingEventsQuery = `
  *[_type == "event" && defined(slug.current)
    && coalesce(endDate, startDate) >= now()]
  | order(startDate asc){${EVENT_CARD}}
`

/** The single next event, for the strip under the hero. */
export const nextEventQuery = `
  *[_type == "event" && defined(slug.current) && !cancelled
    && coalesce(endDate, startDate) >= now()]
  | order(startDate asc)[0]{${EVENT_CARD}}
`

/**
 * Past events that have been written up.
 *
 * `defined(recap)` is the filter that matters: an event with no write-up is
 * not evidence of anything, and showing an empty one on the page a grant
 * reviewer reads is worse than showing nothing.
 */
export const pastEventsWithRecapQuery = `
  *[_type == "event" && defined(slug.current)
    && coalesce(endDate, startDate) < now()
    && defined(recap)]
  | order(startDate desc){
    ${EVENT_CARD},
    recap,
    "gallery": gallery[]${IMAGE}
  }
`

/** Recent write-ups for the home page. Same as above, limited. */
export const recentRecapsQuery = `
  *[_type == "event" && defined(slug.current)
    && coalesce(endDate, startDate) < now()
    && defined(recap)]
  | order(startDate desc)[0...$limit]{
    ${EVENT_CARD},
    recap,
    "gallery": gallery[]${IMAGE}
  }
`

export const eventBySlugQuery = `
  *[_type == "event" && slug.current == $slug][0]{
    ${EVENT_CARD},
    body, recap, signupUrl, seoDescription,
    "gallery": gallery[]${IMAGE}
  }
`

/** Every event slug, for generating the static pages. */
export const allEventSlugsQuery = `
  *[_type == "event" && defined(slug.current)].slug.current
`

/* ------------------------------------------------------------- news, pages */

export const recentNewsQuery = `
  *[_type == "newsPost" && defined(slug.current)]
  | order(publishedAt desc)[0...$limit]{
    _id, title, "slug": slug.current, publishedAt, summary,
    "image": image${IMAGE}
  }
`

export const pageBySlugQuery = `
  *[_type == "page" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, summary, body, seoDescription,
    "image": image${IMAGE}
  }
`

export const allPageSlugsQuery = `
  *[_type == "page" && defined(slug.current)].slug.current
`

/* ------------------------------------------------------------------ people */

export const boardQuery = `
  *[_type == "person"] | order(order asc, name asc){
    _id, name, role, bio,
    "photo": photo${IMAGE}
  }
`
