import {defineField, defineType} from 'sanity'

import {HEADING_GUIDANCE} from './blockContent'

/**
 * A piece of news: something worth telling people about that is not an event.
 *
 * A grant awarded, a garden bed built, a new instructor, a thank you to the
 * people who turned out — the things that happen between events and would
 * otherwise never be written down anywhere a visitor can see.
 *
 * If the news *is* about an event — how it went, how much it raised, who came —
 * it belongs in that event's write-up instead, not here. Keeping the two apart
 * is what stops the site growing two parallel histories of the same thing, and
 * it is the reason this type stayed small when photographs were added to it in
 * decision 037: an article can carry pictures, but the pictures of an event go
 * on the event.
 *
 * Modeled on the second half of `event` on purpose. An editor who has written
 * up an event already knows how this works — a headline, a summary, the words,
 * and the photographs underneath — and a maintainer reading one of the two
 * files has read most of the other.
 */
export const newsPost = defineType({
  name: 'newsPost',
  title: 'News article',
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
      description:
        'Generated from the headline — press Generate. Once an article has ' +
        'been published, do not change this: anything already shared on ' +
        'Facebook points at the old address and will stop working.',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),

    /**
     * The same optional reference the event carries, and optional for the same
     * reason: some news belongs to the organization rather than to any one
     * program — a grant, an annual report, a thank you to everybody.
     *
     * An article with no program area still appears on /news. What it does not
     * appear on is any program page, which is the correct answer rather than a
     * gap: those pages are about one program's work.
     */
    defineField({
      name: 'program',
      title: 'Program area',
      type: 'reference',
      to: [{type: 'program'}],
      description:
        'Which of the areas this is about. It puts the article on that ' +
        "program's page and in its news list, and links back to the program " +
        'from the article. Leave it empty for news about FotVG as a whole — ' +
        'that still appears in the main news list.',
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
      description:
        'One or two sentences, shown in the news list, on the program page, ' +
        'and in the link preview when someone shares the article. Under 160 ' +
        'characters reads best.',
      validation: (Rule) => Rule.required().max(200),
    }),

    defineField({
      name: 'body',
      title: 'The article',
      type: 'blockContent',
      description: `The article itself. ${HEADING_GUIDANCE}`,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Main photograph',
      type: 'figure',
      description:
        'Optional. Shown at the top of the article and used for the link ' +
        'preview when it is shared. Landscape works best.',
    }),

    /**
     * The same field, with the same guidance, as the event's gallery. An
     * article about the new raised beds should be able to show them.
     */
    defineField({
      name: 'gallery',
      title: 'Photographs',
      type: 'array',
      of: [{type: 'figure'}],
      description:
        'Optional, and shown underneath the article. Six to twelve good ' +
        'pictures, not forty average ones. Read docs/photos.md before ' +
        'uploading — permission has to be recorded in writing, and photographs ' +
        'of children need written board sign-off.',
      validation: (Rule) =>
        Rule.max(24).warning(
          'That is a lot of photographs. Twelve well-chosen ones do more work than forty.',
        ),
    }),

    defineField({
      name: 'seoDescription',
      title: 'Search description',
      type: 'text',
      rows: 2,
      description:
        'Optional. What Google shows under the page title. Leave empty and the ' +
        'short summary is used instead, which is usually right.',
      validation: (Rule) => Rule.max(160),
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
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      media: 'image',
      program: 'program.name',
    },
    prepare({title, publishedAt, media, program}) {
      /* Pacific, explicitly, for the same reason as everywhere else on this
         site: the Studio may be open anywhere, and the build server runs in
         UTC. See src/lib/dates.js. */
      const when = publishedAt
        ? new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Los_Angeles',
            dateStyle: 'medium',
          }).format(new Date(publishedAt))
        : 'No date'

      return {title, subtitle: program ? `${when} · ${program}` : when, media}
    },
  },
})
