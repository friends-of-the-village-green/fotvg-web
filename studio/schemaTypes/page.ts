import {defineField, defineType} from 'sanity'

/**
 * A standing page: About, Get Involved, Contact, What we're dreaming about.
 *
 * For prose that changes once or twice a year. If a page needs its own layout
 * or its own fields, it is not a `page` — it is a real Astro page, and that is
 * usually the right answer.
 */
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      description: 'Shown as the heading, in the browser tab, and in search results.',
      validation: (Rule) => Rule.required().max(70),
    }),

    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      description:
        'Generated from the title — press Generate. Changing it on a published ' +
        'page breaks every existing link to it.',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'summary',
      title: 'Short summary',
      type: 'text',
      rows: 2,
      description:
        'One or two sentences, shown under the heading and in the link preview ' +
        'when the page is shared.',
      validation: (Rule) => Rule.required().max(200),
    }),

    defineField({
      name: 'body',
      title: 'Page text',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Main photograph',
      type: 'figure',
      description: 'Optional. Shown at the top of the page.',
    }),

    defineField({
      name: 'seoDescription',
      title: 'Search description',
      type: 'text',
      rows: 2,
      description: 'Optional. Falls back to the short summary.',
      validation: (Rule) => Rule.max(160),
    }),
  ],

  preview: {
    select: {title: 'title', subtitle: 'slug.current', media: 'image'},
  },
})
