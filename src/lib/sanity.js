/**
 * The Sanity client, and the image URL builder.
 *
 * This site only ever *reads* from Sanity. Writing happens in the Studio, by
 * humans. There is no write token anywhere in this codebase and there must
 * never be one — see CLAUDE.md.
 */
import {createClient} from '@sanity/client'
import {createImageUrlBuilder} from '@sanity/image-url'

/**
 * The project ID is in the repository on purpose.
 *
 * It is not a secret: it ships in the browser bundle of every Sanity-backed
 * site on the internet, and the `production` dataset is public, so anyone can
 * already read this content — it is a public website. What must stay out of
 * the repo is a *token*, and there isn't one, because reading a public dataset
 * needs no authentication.
 *
 * Having a working default rather than a required environment variable is a
 * deliberate robustness choice: a missing variable in Netlify would fail the
 * build and take the live site down for a value that was never sensitive. The
 * env vars still override, so a second dataset for testing is one setting away.
 */
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'nd22vlzw'
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'

export const client = createClient({
  projectId,
  dataset,

  /* Pin the API version. Sanity treats an unpinned version as "today", which
     means a build could change behavior on a day nobody touched the code. */
  apiVersion: '2024-01-01',

  /* The CDN is cached and cheaper against a metered quota. Content is fetched
     at build time, and a build is triggered when content is published, so the
     few minutes of cache lag costs nothing. */
  useCdn: true,

  /* Never fetch drafts. Without a token they are invisible anyway, but being
     explicit means an accidentally-added token cannot leak an unfinished
     event onto the live site. */
  perspective: 'published',
})

const builder = createImageUrlBuilder(client)

/**
 * Build a URL for a Sanity image.
 *
 *   urlFor(image).width(800).height(450).fit('crop').auto('format').url()
 *
 * Always finish with `.auto('format')` so modern browsers get WebP or AVIF,
 * and always give an explicit width. Volunteer photographs are routinely
 * 4000px originals; serving one of those to a phone burns bandwidth quota for
 * no visible benefit.
 */
export const urlFor = (source) => builder.image(source)
