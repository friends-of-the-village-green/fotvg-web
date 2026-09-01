/**
 * Where a link goes, and whether that means a new tab.
 *
 * The rule, set by the board on 1 September 2026: **a link that leaves this
 * site opens in a new tab; a link within the site stays in the same one.**
 *
 * This is the single place that decides which is which. It lives here rather
 * than being repeated in each component so the answer cannot drift — the
 * failure that prompted it was email links behaving one way in a component and
 * another way in Studio content, which is not a distinction a reader can see.
 *
 * Internal links in this codebase are relative: `/events`, `#give`. Anything
 * carrying a scheme is leaving — `https:`, and also `mailto:` and `tel:`, which
 * hand off to another program.
 *
 * The one exception worth having: an editor who writes an absolute link back to
 * fotvg.org in the Studio is still linking internally, and should not get a new
 * tab for it.
 */

const INTERNAL_HOSTS = new Set(['fotvg.org', 'www.fotvg.org'])

export function isExternal(href) {
  if (typeof href !== 'string') return false

  const value = href.trim()
  if (!value) return false

  // Relative path, page anchor, or query string — always internal.
  if (value.startsWith('/') || value.startsWith('#') || value.startsWith('?')) {
    return false
  }

  // A web address: external unless it points back at this site.
  if (/^https?:\/\//i.test(value)) {
    try {
      return !INTERNAL_HOSTS.has(new URL(value).hostname.toLowerCase())
    } catch {
      // Not parseable as a URL. Treat it as internal rather than opening a new
      // tab onto something we do not understand.
      return false
    }
  }

  // mailto:, tel:, and anything else with a scheme hands off to another app.
  // A bare relative link like `events/summer` has no scheme and stays internal.
  return /^[a-z][a-z0-9+.-]*:/i.test(value)
}

/**
 * The screen-reader-only note that accompanies a new-tab link.
 *
 * Sighted users are told by the `↗` on the Donate button; everywhere else the
 * new tab is unannounced visually, which the board considered and accepted —
 * arrows on every plain text link would be noise. This note is what keeps the
 * accessibility checklist's "links that open a new tab say so" true for
 * everyone else.
 *
 * `destination` names where the reader is going when that is worth saying —
 * "Square, our card processor" — and is omitted when the link text already
 * makes it obvious.
 */
export function newTabNote(destination) {
  return destination
    ? `(opens ${destination}, in a new tab)`
    : '(opens in a new tab)'
}
