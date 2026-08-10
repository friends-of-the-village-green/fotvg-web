import {defineField, defineType} from 'sanity'

/**
 * An event, in both of its phases.
 *
 * An event is announced, it happens, and then it is written up with
 * photographs. Both phases live on **one document**. An editor writing up last
 * Saturday's concert opens the event they already made and fills in the bottom
 * half — there is no second thing to create and nothing to remember to link up.
 *
 * The write-up is the part the board cares most about. Grant reviewers read it
 * as evidence that FotVG delivers what it says it will, which is why past
 * events keep their URL and stay published indefinitely. See decision 008.
 */
export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',

  groups: [
    {name: 'before', title: 'Before it happens', default: true},
    {name: 'after', title: 'Afterwards — the write-up'},
    {name: 'seo', title: 'Search and sharing'},
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Event name',
      type: 'string',
      group: 'before',
      description: 'What it is called. "Music at the Green", "The orchard prune".',
      validation: (Rule) => Rule.required().max(90),
    }),

    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'before',
      description:
        'Generated from the name — press Generate. Once an event has been ' +
        'published, do not change this: printed flyers and Facebook posts point ' +
        'at the old address and will stop working.',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'program',
      title: 'Program area',
      type: 'reference',
      group: 'before',
      to: [{type: 'program'}],
      description:
        'Which of the three areas this belongs to. Shown next to the event and ' +
        'linked to that program page. Leave empty if it genuinely belongs to none.',
    }),

    defineField({
      name: 'startDate',
      title: 'Starts',
      type: 'datetime',
      group: 'before',
      description: 'Date and start time. Times are Pacific.',
      options: {dateFormat: 'YYYY-MM-DD', timeFormat: 'h:mm a'},
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'endDate',
      title: 'Ends',
      type: 'datetime',
      group: 'before',
      description:
        'Optional. Use it for an end time on the day, or for the last day of a ' +
        'multi-day event. For something that repeats weekly, make one event per ' +
        'occurrence — it is easier to read and easier to cancel one of them.',
      options: {dateFormat: 'YYYY-MM-DD', timeFormat: 'h:mm a'},
      validation: (Rule) =>
        Rule.min(Rule.valueOfField('startDate')).warning(
          'The end is before the start. Check the dates.',
        ),
    }),

    defineField({
      name: 'location',
      title: 'Where',
      type: 'string',
      group: 'before',
      description:
        'Somewhere a person can find. "The community garden", "Kingston Village ' +
        'Green Park". Not a full street address.',
      validation: (Rule) => Rule.required().max(80),
    }),

    defineField({
      name: 'summary',
      title: 'Short summary',
      type: 'text',
      rows: 3,
      group: 'before',
      description:
        'One or two sentences, shown in event listings and in the link preview ' +
        'when someone shares the page. Under 160 characters reads best.',
      validation: (Rule) => Rule.required().max(200),
    }),

    defineField({
      name: 'body',
      title: 'Full description',
      type: 'blockContent',
      group: 'before',
      description: 'Everything a person needs in order to decide to come, and to turn up.',
    }),

    defineField({
      name: 'image',
      title: 'Main photograph',
      type: 'figure',
      group: 'before',
      description:
        'Shown at the top of the event page and in listings. Landscape works ' +
        'best. Before the event this might be a picture from last year.',
    }),

    defineField({
      name: 'signupUrl',
      title: 'Sign-up link',
      type: 'url',
      group: 'before',
      description:
        'Optional. Only if people have to register somewhere. Leave empty for ' +
        'anything people can just turn up to.',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),

    defineField({
      name: 'cancelled',
      title: 'Cancelled',
      type: 'boolean',
      group: 'before',
      initialValue: false,
      description:
        'Tick this rather than deleting the event. The page stays up and says ' +
        'plainly that it is cancelled, which is what someone holding a flyer ' +
        'needs to see.',
    }),

    /* ---- Afterwards ---------------------------------------------------- */

    defineField({
      name: 'recap',
      title: 'How it went',
      type: 'blockContent',
      group: 'after',
      description:
        'A short write-up, added after the event. Two or three paragraphs is ' +
        'plenty. Say what happened, roughly how many people came, and anything ' +
        'that made it worth doing. This is what a grant reviewer reads. ' +
        'Filling this in is what moves the event into "What we have done".',
    }),

    defineField({
      name: 'gallery',
      title: 'Photographs',
      type: 'array',
      group: 'after',
      of: [{type: 'figure'}],
      description:
        'Six to twelve good pictures, not forty average ones. Look for people ' +
        'doing the thing, a sense of place, and a range of ages. Read ' +
        'docs/photos.md before uploading — permission has to be recorded in ' +
        'writing, and photographs of children need written board sign-off.',
      validation: (Rule) =>
        Rule.max(24).warning(
          'That is a lot of photographs. Twelve well-chosen ones do more work than forty.',
        ),
    }),

    /* ---- SEO ------------------------------------------------------------ */

    defineField({
      name: 'seoDescription',
      title: 'Search description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description:
        'Optional. What Google shows under the page title. Leave empty and the ' +
        'short summary is used instead, which is usually right.',
      validation: (Rule) => Rule.max(160),
    }),
  ],

  orderings: [
    {
      title: 'Date, newest first',
      name: 'startDateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
    {
      title: 'Date, oldest first',
      name: 'startDateAsc',
      by: [{field: 'startDate', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title: 'title',
      startDate: 'startDate',
      media: 'image',
      cancelled: 'cancelled',
      recap: 'recap',
    },
    prepare({title, startDate, media, cancelled, recap}) {
      /* Pacific, explicitly. The Studio may be open anywhere, and an evening
         event shown a day out is exactly the confusion we are avoiding. */
      const when = startDate
        ? new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Los_Angeles',
            dateStyle: 'medium',
          }).format(new Date(startDate))
        : 'No date'

      const status = cancelled ? ' · CANCELLED' : recap ? ' · written up' : ''

      return {title, subtitle: `${when}${status}`, media}
    },
  },
})
