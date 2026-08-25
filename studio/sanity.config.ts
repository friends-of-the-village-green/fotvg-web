import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Friends of the Village Green',

  projectId: 'nd22vlzw',
  dataset: 'production',

  /**
   * Sanity Media Library — an organization-wide asset library with tagging and
   * search that does not depend on remembering a filename.
   *
   * WHAT THIS CHANGES FOR AN EDITOR: the image picker gains a second source.
   * Uploading still works exactly as before; alongside it there is now a
   * library to search, shared across the organization rather than living in
   * this one dataset.
   *
   * WHY IT DOES NOT BREAK THE SITE: picking a library asset creates a *linked
   * asset document in this project dataset* — that is what the Assets API's
   * /media-library-link endpoint does, and it is why previews work. So an
   * image field still holds an ordinary asset reference, `asset->` still
   * dereferences, and the IMAGE projection in src/lib/queries.js and
   * @sanity/image-url both carry on unchanged. Assets already uploaded are
   * untouched and stay exactly where they are.
   *
   * Verify that on a real photograph before trusting this comment.
   */
  mediaLibrary: {
    enabled: true,
  },

  /**
   * Token login rather than cookies, which Sanity requires for the Media
   * Library to be fully functional — private asset preview, downloads, signing
   * keys and usage tracking are all unsupported on cookie auth.
   *
   * The cost is that editors are signed out once and have to sign in again.
   * Worth knowing before this goes out on a morning somebody is mid-write-up.
   */
  auth: {
    loginMethod: 'token',
  },

  plugins: [
    structureTool({
      /**
       * The sidebar, in the order an editor actually uses it.
       *
       * Events are what people come here to change, so they are first. Site
       * settings opens the single document directly rather than a list of one —
       * without this, an editor can create a second settings document, change
       * that, and be quite reasonably baffled when nothing happens on the site.
       */
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('event').title('Events'),
            S.documentTypeListItem('newsPost').title('News articles'),
            S.documentTypeListItem('program').title('Program areas'),
            S.documentTypeListItem('page').title('Pages'),
            S.documentTypeListItem('person').title('People'),

            S.divider(),

            S.listItem()
              .title('Site settings')
              .id('siteSettings')
              .child(
                S.document().schemaType('siteSettings').documentId('siteSettings'),
              ),
          ]),
    }),

    /* Vision runs GROQ queries against the dataset. Useful when working out a
       query for the site; harmless otherwise. */
    visionTool(),
  ],

  schema: {
    types: schemaTypes,

    /* Site settings is a singleton — keep it out of the global "create new"
       menu so the only way to reach it is the sidebar item above. */
    templates: (prev) => prev.filter((template) => template.schemaType !== 'siteSettings'),
  },

  document: {
    /* And remove "duplicate" / "delete" from the settings document itself. */
    actions: (prev, {schemaType}) =>
      schemaType === 'siteSettings'
        ? prev.filter(({action}) => action !== 'duplicate' && action !== 'delete')
        : prev,
  },
})
