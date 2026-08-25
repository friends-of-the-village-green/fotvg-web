import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Friends of the Village Green',

  projectId: 'nd22vlzw',
  dataset: 'production',

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
