/**
 * Date formatting, pinned to Pacific time.
 *
 * Everything on this site happens in Kingston, Washington. The Netlify build
 * server runs in UTC, so an evening event — which is most of them — formats to
 * the *following day* if you let the default locale decide. A concert on
 * Wednesday the 12th at 6:30pm becomes "Thursday, August 13" and someone turns
 * up on the wrong evening.
 *
 * That is the single most common bug in a site like this. Never call
 * `toLocaleDateString` directly. Use these.
 */

const TIME_ZONE = 'America/Los_Angeles'

const format = (iso, options) => {
  if (!iso) return ''

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-US', {timeZone: TIME_ZONE, ...options}).format(date)
}

/** "Wednesday, August 12" — for an event heading. */
export const formatEventDate = (iso) =>
  format(iso, {weekday: 'long', month: 'long', day: 'numeric'})

/** "Wed, Aug 12" — for a listing row, where space is tight. */
export const formatShortDate = (iso) =>
  format(iso, {weekday: 'short', month: 'short', day: 'numeric'})

/** "6:30 PM". Empty string if the event has no meaningful time. */
export const formatTime = (iso) => format(iso, {hour: 'numeric', minute: '2-digit'})

/** "Wednesday, August 12 · 6:30 PM" */
export const formatDateAndTime = (iso) => {
  const day = formatEventDate(iso)
  const time = formatTime(iso)
  return day && time ? `${day} · ${time}` : day
}

/** "August 2026" — for grouping past events by month. */
export const formatMonthAndYear = (iso) => format(iso, {month: 'long', year: 'numeric'})

/**
 * The machine-readable value for a `<time datetime="…">` attribute: the date
 * in Pacific, as YYYY-MM-DD. Deliberately not `iso.slice(0, 10)`, which would
 * give the UTC date and reintroduce the off-by-one-day bug this file exists to
 * prevent.
 */
export const toDateAttribute = (iso) => {
  if (!iso) return ''

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  /* en-CA formats as YYYY-MM-DD, which is what the HTML attribute wants. */
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/**
 * Has this event happened?
 *
 * Uses the end date when there is one, so a garden tour that runs all Saturday
 * is not listed as past at ten in the morning.
 */
export const isPast = (event, now = new Date()) => {
  const end = event?.endDate || event?.startDate
  if (!end) return false

  return new Date(end).getTime() < now.getTime()
}
