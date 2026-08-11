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
 * Site settings from Sanity, with the hardcoded values in site.js as a
 * fallback. The fallback matters for exactly one situation — the settings
 * document has not been created yet — and it means the header and footer
 * cannot render blank because someone has not opened the Studio.
 */
export async function getSiteSettings() {
  if (!settingsPromise) settingsPromise = client.fetch(siteSettingsQuery)

  const settings = (await settingsPromise) || {}

  return {
    name: settings.organizationName || fallback.name,
    tagline: settings.tagline || fallback.location,
    email: settings.contactEmail || fallback.email,
    address: settings.postalAddress || fallback.address,
    donateUrl: settings.donateUrl || fallback.donateUrl,
    socialLinks: settings.socialLinks || [],
    heroImage: settings.heroImage || null,

    /**
     * Falls back to the hero photograph.
     *
     * The order that matters is: a page's own picture, then an explicitly
     * chosen sharing image, then the hero. The hero is already a landscape
     * photograph the board picked deliberately, so it makes a far better link
     * preview than nothing at all — and "nothing at all" is what the home page
     * was serving, on a site whose traffic mostly arrives from Facebook and
     * Nextdoor.
     *
     * Setting a separate sharing image still wins, for when the hero crops
     * badly to a wide letterbox.
     */
    shareImage: settings.shareImage || settings.heroImage || null,
    founded: fallback.founded,
  }
}

/**
 * The main navigation.
 *
 * Built from what actually exists, so there is never a link to an empty
 * section or a Donate button with nowhere to go.
 */
export async function getNav() {
  if (!sectionsPromise) sectionsPromise = client.fetch(homeSectionsQuery)

  const sections = (await sectionsPromise) || {}
  const settings = await getSiteSettings()

  const items = []

  /* Order follows the page. "What's on" is the board's own wording from the
     mock-ups — John is checking with them whether they would rather it read
     "Upcoming", which would be a one-line change here. */
  if (sections.hasRecaps) items.push({label: "What we've done", href: '/#done'})
  if (sections.hasUpcoming) items.push({label: "What's on", href: '/#upcoming'})
  if (sections.hasPrograms) items.push({label: 'What we support', href: '/#support'})

  if (settings.donateUrl) {
    items.push({label: 'Donate', href: settings.donateUrl, isDonate: true})
  }

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
