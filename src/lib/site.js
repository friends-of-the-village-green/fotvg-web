/**
 * Site-wide constants.
 *
 * This is a temporary home. Most of it belongs in the Sanity `siteSettings`
 * singleton (docs/content-model.md) so the board can change it without a
 * developer. It lives here until the schema is built, so that the layout has
 * one place to read these from rather than hard-coding them in five files.
 *
 * When siteSettings exists, replace the imports — not the shape.
 */

export const site = {
  name: 'Friends of the Village Green',

  /* The abbreviation is FotVG. Not FOTVG. See CLAUDE.md. */
  shortName: 'FotVG',

  location: 'Kingston, Washington',

  /**
   * The public contact address is the Community Center, always.
   * Never the registered agent's home address — it appears in the source
   * documents and on the old GoDaddy site, and it must not appear here.
   * See docs/organization.md.
   */
  address: 'Village Green Community Center, 26159 Dulay Road NE, Kingston, WA',

  /**
   * TK — confirm which address the board wants published for general email.
   * tech@fotvg.org is Catherine's role address and is probably not it.
   */
  email: null,

  /**
   * TK — the Square donation link (decision 007). Until this is a real URL,
   * the Donate call to action is not rendered anywhere. That is deliberate:
   * a Donate button that goes nowhere is worse than no Donate button, and an
   * invented URL is worse than both.
   */
  donateUrl: null,

  /**
   * Square links for a gift directed at one program — [{program, url}].
   *
   * Empty is the normal state and renders nothing. It is not a TK: the general
   * Donate link is the one the site needs, and these are an addition the board
   * asked for on 18 August 2026, to be filled in once the three matching links
   * exist in Square.
   */
  programDonateLinks: [],

  founded: 2025,
}

/**
 * Main navigation.
 *
 * Only sections that actually exist are listed. As the home page sections and
 * the program pages get built, add them here — do not add a link before its
 * target exists, because an anchor to a missing id silently does nothing and
 * is confusing for a screen reader user.
 */
export const mainNav = [
  { label: 'What we support', href: '/#support' },
]
