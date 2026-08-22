import {defineField, defineType} from 'sanity'

import {HEADING_GUIDANCE} from './blockContent'

/**
 * A short update that is not tied to an event.
 *
 * If the news *is* about an event — how it went, how much it raised, who came —
 * it belongs in that event's write-up instead, not here. Keeping the two apart
 * is what stops the site growing two parallel histories of the same thing.
 */
export const newsPost = defineType({
  name: 'newsPost',
  title: 'News update',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required().max(90),
    }),

    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      description: 'Generated from the headline — press Generate.',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'publishedAt',
      title: 'Date',
      type: 'datetime',
      description:
        'The date this goes out, used to order the news list. Type it as ' +
        '2026-10-06 9:00 am, or click the calendar icon. Times are Pacific.',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'h:mm a',
        displayTimeZone: 'America/Los_Angeles',
        allowTimeZoneSwitch: false,
      },
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'summary',
      title: 'Short summary',
      type: 'text',
      rows: 2,
      description: 'One or two sentences, shown in the news list and in link previews.',
      validation: (Rule) => Rule.required().max(200),
    }),

    defineField({
      name: 'body',
      title: 'The update',
      type: 'blockContent',
      description: `The update itself. ${HEADING_GUIDANCE}`,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Photograph',
      type: 'figure',
      description: 'Optional.',
    }),
  ],

  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],

  preview: {
    select: {title: 'title', publishedAt: 'publishedAt', media: 'image'},
    prepare({title, publishedAt, media}) {
      const when = publishedAt
        ? new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Los_Angeles',
            dateStyle: 'medium',
          }).format(new Date(publishedAt))
        : 'No date'

      return {title, subtitle: when, media}
    },
  },
})
