/**
 * Content that every page needs, fetched once per build.
 *
 * Site settings and the navigation are needed by BaseLayout, which means every
 * single page. Without memoizing, a twenty-page build makes forty identical
 * requests against a metered quota. Module scope persists for the whole build,
 * so caching the promise is enough — no library, no cache invalidation, and it
 * disappears the moment the build ends.
 */
import {client} from './sanity.js'
import {homeSectionsQuery, siteSettingsQuery, standingPagesQuery} from './queries.js'
import {site as fallback} from './site.js'

let settingsPromise
let sectionsPromise
let pagesPromise

/**
 * An empty rich-text field comes back from Sanity as an empty array, and an
 * empty array is truthy — so `value || fallback` would hand the template a
 * live-looking value with nothing in it, and the fallback copy would never
 * appear. Normalize both empty cases to null so `||` behaves.
 */
const text = (value) => (Array.isArray(value) && value.length ? value : null)

/**
 * Site settings from Sanity, with the hardcoded values in site.js as a
 * fallback. The fallback matters for exactly one situation — the settings
 * document has not been created yet — and it means the header and footer
 * cannot render blank because someone has not opened the Studio.
 */
export async function getSiteSettings() {
  if (!settingsPromise) settingsPromise = client.fetch(siteSettingsQuery)

  const settings = (await settingsPromise) || {}

  /**
   * The home page photographs, from the field that holds several — falling
   * back to the single `heroImage` this replaced (decision 036).
   *
   * The fallback is the entire migration. Deploying the new field to a Studio
   * whose settings document still has the old one filled in would otherwise
   * take the photograph off the home page, and nobody would know until the
   * board looked. It costs three lines here and no script at all.
   *
   * Delete this — and the schema field, and the line in siteSettingsQuery —
   * once Site settings has been saved with a photograph in `heroImages`.
   */
  const heroImages = settings.heroImages?.length
    ? settings.heroImages
    : settings.heroImage
      ? [settings.heroImage]
      : []

  return {
    name: settings.organizationName || fallback.name,
    tagline: settings.tagline || fallback.location,
    email: settings.contactEmail || fallback.email,
    address: settings.postalAddress || fallback.address,
    donateUrl: settings.donateUrl || fallback.donateUrl,

    /**
     * Both halves of a program link have to be there for it to be worth
     * rendering: a program name with no link is a dead end, and a link with no
     * name is one a screen reader announces as nothing at all. The Studio
     * requires both, but a half-finished draft can still reach a build.
     */
    programDonateLinks: (
      settings.programDonateLinks || fallback.programDonateLinks
    ).filter((link) => link?.program && link?.url),

    socialLinks: settings.socialLinks || [],
    heroImages,

    /**
     * The blocks of copy on the home page.
     *
     * Null rather than a default when a field is empty, because the fallback
     * copy lives in the templates alongside the design it was written for —
     * not here, and not in site.js, which is for values the whole site reads.
     */
    home: {
      eyebrow: settings.heroEyebrow || null,
      heading: settings.heroHeading || null,
      lede: text(settings.heroLede),

      supportMoreHeading: settings.supportMoreHeading || null,
      supportMoreText: text(settings.supportMoreText),

      disambiguationHeading: settings.disambiguationHeading || null,
      disambiguationText: text(settings.disambiguationText),
    },

    /* The green band. Separate from `home` only because it is its own tab in
       the Studio and its own component here; it is the same home page. */
    give: {
      donateHeading: settings.donateHeading || null,
      donateText: text(settings.donateText),
      donateFeeText: text(settings.donateFeeText),
      donateByCheck: text(settings.donateByCheck),
      volunteerHeading: settings.volunteerHeading || null,
      volunteerText: text(settings.volunteerText),
    },

    /**
     * Falls back to the hero photograph.
     *
     * The order that matters is: a page's own picture, then an explicitly
     * chosen sharing image, then the first of the hero photographs. That one is
     * already a landscape photograph the board picked deliberately, so it makes
     * a far better link preview than nothing at all — and "nothing at all" is
     * what the home page was serving, on a site whose traffic mostly arrives
     * from Facebook and Nextdoor.
     *
     * The *first* of them, not a different one each build: a link preview that
     * changed under a Facebook post already shared is a small mystery nobody
     * needs.
     *
     * Setting a separate sharing image still wins, for when the hero crops
     * badly to a wide letterbox.
     */
    shareImage: settings.shareImage || heroImages[0] || null,
    founded: fallback.founded,
  }
}

/**
 * The main navigation.
 *
 * The home page sections are built from what actually exists, so there is never
 * a link to an empty one. Donate is the exception and is always present: it
 * points at a section of this site that always renders.
 */
export async function getNav() {
  if (!sectionsPromise) sectionsPromise = client.fetch(homeSectionsQuery)

  const sections = (await sectionsPromise) || {}

  const items = []

  /* Order follows the page. "What's on" is the board's own wording from the
     mock-ups — John is checking with them whether they would rather it read
     "Upcoming", which would be a one-line change here. */
  if (sections.hasRecaps) items.push({label: "What we've done", href: '/#done'})

  /* Unconditional, unlike the two beside it. The What's on section now renders
     even with nothing on the calendar, because it says so in a sentence rather
     than vanishing (decision 032) — so the #upcoming target always exists and
     the link can never point at a section that did not render. */
  items.push({label: "What's on", href: '/#upcoming'})

  /* A page of its own rather than a section of the home page, so this link
     leaves the home page where the three above it jump around inside it. It
     sits here because it is the last of the "what is happening" items and
     before the one that asks for money.

     Conditional, like the sections above it and for the same reason: until
     somebody writes the first article there is nothing behind it. The /news
     page is still built and still says so — it is the menu item that would be
     making a promise. */
  if (sections.hasNews) items.push({label: 'News', href: '/news'})

  if (sections.hasPrograms) items.push({label: 'What we support', href: '/#support'})

  /* The Donate link goes to the section further down this page, not straight
     out to Square. The band now carries things a donor needs before paying:
     the invitation to cover the card fee, the per-program links, and the check
     address for anyone who would rather not use a card (board, 18 August 2026).
     Jumping to Square skips all of it.

     Unconditional, unlike the sections above it. GiveBand always renders — with
     the real button, or with the placeholder standing in for it — so the #give
     target always exists, whether or not the Square link has been filled in. */
  items.push({label: 'Donate', href: '/#give', isDonate: true})

  return items
}

/**
 * Standing pages, for the footer.
 *
 * They go in the footer rather than the header deliberately. The header has no
 * mobile menu — links wrap onto a second line — which works while there are
 * three or four of them and stops working at seven. The footer takes as many
 * as the board cares to write, and any page that earns a place in the header
 * can be promoted by hand in getNav above.
 *
 * The important part is that they are linked *somewhere* automatically. A page
 * an editor publishes and cannot then find is the same failure as having no
 * route for it at all.
 */
export async function getStandingPages() {
  if (!pagesPromise) pagesPromise = client.fetch(standingPagesQuery)

  return (await pagesPromise) || []
}

/**
 * Everything the footer links to: the standing pages an editor has written,
 * plus the board page, which is a real route rather than a `page` document and
 * so has to be added by hand.
 *
 * The board page appears only once there is somebody on it. A "The board" link
 * leading to an empty page is worse than no link, particularly for the grant
 * reviewer who is the reason that page exists.
 */
export async function getFooterLinks() {
  if (!sectionsPromise) sectionsPromise = client.fetch(homeSectionsQuery)

  const [pages, sections] = await Promise.all([getStandingPages(), sectionsPromise])

  const links = pages.map((page) => ({title: page.title, href: `/${page.slug}`}))

  if (sections?.hasPeople) links.push({title: 'The board', href: '/board'})

  return links
}
