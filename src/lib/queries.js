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

/**
 * The filter every event query begins with. Do not write a new event query
 * without it.
 *
 * `archived != true` rather than the `!archived` that reads more naturally, and
 * the difference is not cosmetic. Events created before the field existed have
 * no `archived` at all, and in GROQ `!archived` on a missing field evaluates
 * `!null` → `null`, which is not true — so that spelling would quietly drop
 * every event on the site rather than the handful an editor has hidden.
 * `null != true` is true, so this spelling includes them. Same trap for
 * `cancelled` below, which is why that one is spelled the same way.
 *
 * Archiving takes an event off the site completely, including its own page:
 * `allEventSlugsQuery` reads this too, so no page is generated for it at all
 * (decision 030).
 */
const LIVE_EVENT = `_type == "event" && defined(slug.current) && archived != true`

/* Past, and written up. The two conditions always travel together: an event
   with no write-up is not evidence of anything, and showing an empty one on
   the page a grant reviewer reads is worse than showing nothing. */
const WRITTEN_UP = `coalesce(endDate, startDate) < now() && defined(recap)`

/* ---------------------------------------------------------------- settings */

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0]{
    organizationName, tagline, contactEmail, postalAddress, donateUrl,
    programDonateLinks[]{program, url},
    socialLinks[]{platform, url},
    heroEyebrow, heroHeading, heroLede,
    supportMoreHeading, supportMoreText,
    disambiguationHeading, disambiguationText,
    donateHeading, donateText, donateFeeText, donateByCheck,
    volunteerHeading, volunteerText,
    "heroImage": heroImage${IMAGE},
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

/* `recapCount` decides whether the page offers a link to this program's own
   archive. Zero write-ups, no link — see programRecapCountsQuery below, which
   is the same count and the reason the filtered pages exist at all. */
export const programBySlugQuery = `
  *[_type == "program" && slug.current == $slug][0]{
    _id, name, "slug": slug.current, summary, mission, vision, body,
    seoDescription,
    "image": image${IMAGE},
    "recapCount": count(*[${LIVE_EVENT} && ${WRITTEN_UP} && program._ref == ^._id])
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

/* The write-up and its photographs, for the queries that show a past event in
   full rather than as a row. */
const EVENT_RECAP = `
  ${EVENT_CARD},
  recap,
  "gallery": gallery[]${IMAGE}
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
  *[${LIVE_EVENT}
    && coalesce(endDate, startDate) >= now()]
  | order(startDate asc){${EVENT_CARD}}
`

/** The single next event, for the strip under the hero. */
export const nextEventQuery = `
  *[${LIVE_EVENT} && cancelled != true
    && coalesce(endDate, startDate) >= now()]
  | order(startDate asc)[0]{${EVENT_CARD}}
`

/** Every past event that has been written up, newest first. */
export const pastEventsWithRecapQuery = `
  *[${LIVE_EVENT} && ${WRITTEN_UP}]
  | order(startDate desc){${EVENT_RECAP}}
`

/**
 * The same list, narrowed to one program area (decision 031).
 *
 * Note what this cannot reach: an event whose program is empty, which the
 * Studio allows for anything that genuinely belongs to none. Those appear on
 * the unfiltered page and on no filtered one, which is the right answer — the
 * unfiltered page is the complete record.
 */
export const pastEventsByProgramQuery = `
  *[${LIVE_EVENT} && ${WRITTEN_UP} && program->slug.current == $program]
  | order(startDate desc){${EVENT_RECAP}}
`

/**
 * Every program, with how many write-ups it has.
 *
 * Drives both the filter links and the pages behind them: a program with
 * nothing written up yet gets no filter link and no page, so a filter can
 * never lead somewhere empty, and the first write-up for a program brings its
 * page into existence on the next build with nobody doing anything.
 *
 * Same principle as the navigation in content.js — build it from what exists,
 * rather than from what ought to.
 */
export const programRecapCountsQuery = `
  *[_type == "program" && defined(slug.current)] | order(name asc){
    name, "slug": slug.current,
    "recapCount": count(*[${LIVE_EVENT} && ${WRITTEN_UP} && program._ref == ^._id])
  }
`

/**
 * The write-ups the board has chosen for the home page (decision 029).
 *
 * `featuredOnHome == true` is deliberately the positive test, not the `!= true`
 * used elsewhere: an event nobody has ticked should not be featured, and a
 * missing field means exactly that.
 *
 * This can legitimately come back empty — nothing is ticked yet, or somebody
 * cleared them all — which is what `recentRecapsQuery` below is for.
 */
export const featuredRecapsQuery = `
  *[${LIVE_EVENT} && ${WRITTEN_UP} && featuredOnHome == true]
  | order(startDate desc)[0...$limit]{${EVENT_RECAP}}
`

/**
 * The fallback for the home page: the most recent write-ups, whatever they are.
 *
 * This was how the home page chose its three write-ups outright, until the
 * board asked for the choice to be theirs. It stays as the safety net, so the
 * section can never render empty (decision 029).
 */
export const recentRecapsQuery = `
  *[${LIVE_EVENT} && ${WRITTEN_UP}]
  | order(startDate desc)[0...$limit]{${EVENT_RECAP}}
`

export const eventBySlugQuery = `
  *[${LIVE_EVENT} && slug.current == $slug][0]{
    ${EVENT_CARD},
    body, recap, signupUrl, seoDescription,
    "gallery": gallery[]${IMAGE}
  }
`

/** Every event slug, for generating the static pages. */
export const allEventSlugsQuery = `
  *[${LIVE_EVENT}].slug.current
`

/**
 * Which home-page sections have anything in them.
 *
 * The navigation is built from this. A menu item pointing at a section that
 * did not render is a link that silently does nothing — worse for someone
 * using a screen reader than not offering the link at all.
 */
export const homeSectionsQuery = `{
  "hasRecaps": count(*[${LIVE_EVENT} && ${WRITTEN_UP}]) > 0,
  "hasUpcoming": count(*[${LIVE_EVENT}
    && coalesce(endDate, startDate) >= now()]) > 0,
  "hasPrograms": count(*[_type == "program" && defined(slug.current)]) > 0,
  "hasPeople": count(*[_type == "person"]) > 0
}`

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

/** Titles and slugs only, for the footer links. */
export const standingPagesQuery = `
  *[_type == "page" && defined(slug.current)] | order(title asc){
    title, "slug": slug.current
  }
`

/* ------------------------------------------------------------------ people */

export const boardQuery = `
  *[_type == "person"] | order(order asc, name asc){
    _id, name, role, bio,
    "photo": photo${IMAGE}
  }
`
