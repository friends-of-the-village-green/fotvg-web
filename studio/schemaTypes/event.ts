import {defineField, defineType} from 'sanity'

import {HEADING_GUIDANCE} from './blockContent'

/**
 * Shared settings for every date field on this site.
 *
 * `displayTimeZone` is the important one. Without it, the Studio shows and
 * interprets times in whatever timezone the editor's computer is set to. Enter
 * a 6:30pm concert from a laptop still on Mountain time and it is stored as
 * 5:30pm Pacific, silently, with nothing on screen to suggest anything is
 * wrong. Pinning the display to Pacific means what an editor types is what the
 * website shows, wherever they happen to be.
 *
 * `allowTimeZoneSwitch: false` removes the control that would let someone undo
 * that by accident. Every event on this site happens in Kingston; there is no
 * case where another timezone is the right answer.
 *
 * The format shown to editors is set here too, and the field descriptions
 * spell it out — the input is strict, and its placeholder vanishes the moment
 * you start typing, which leaves you guessing.
 */
const DATE_OPTIONS = {
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'h:mm a',
  displayTimeZone: 'America/Los_Angeles',
  allowTimeZoneSwitch: false,
}

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
      description:
        'Type it as 2026-10-06 9:00 am — year first, then a space, then the ' +
        'time with am or pm. Or click the calendar icon and pick it, which is ' +
        'easier. All times are Pacific.',
      options: DATE_OPTIONS,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'endDate',
      title: 'Ends',
      type: 'datetime',
      group: 'before',
      description:
        'Optional, same format as above — 2026-10-06 4:00 pm. Use it for an end ' +
        'time on the day, or for the last day of a multi-day event. For ' +
        'something that repeats weekly, make one event per occurrence — it is ' +
        'easier to read and easier to cancel one of them.',
      options: DATE_OPTIONS,
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
      description:
        'Everything a person needs in order to decide to come, and to turn up. ' +
        HEADING_GUIDANCE,
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

    /**
     * Sits next to Cancelled rather than in the write-up tab, even though
     * archiving happens years later.
     *
     * Two reasons. They are the same kind of switch — the two controls that
     * change whether and how an event appears — and an editor hunting for "the
     * checkbox that hides this" will look wherever the other checkbox is. And
     * this tab is the one that opens by default, so archiving a 2024 event
     * takes one click rather than a click and a tab hunt.
     */
    defineField({
      name: 'archived',
      title: 'Archived — hide from the website',
      type: 'boolean',
      group: 'before',
      initialValue: false,
      description:
        'Takes the event off the website completely — the listings, the home ' +
        'page and its own page — while keeping it here in the Studio to copy ' +
        'from when you set up something similar. Use this instead of deleting, ' +
        'which cannot be undone. Untick it and everything comes back at the ' +
        'same web address on the next build. One thing to know: anyone ' +
        'following an old link to an archived event gets a "page not found", ' +
        'so think twice about archiving something recent that people may still ' +
        'have a link to.',
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

    /**
     * Which write-ups reach the home page, chosen rather than computed.
     *
     * It used to be "the three most recent with a write-up", which looked
     * deterministic and was not: it happened to give one event per program
     * area, and would have become three concerts the moment two more music
     * events were written up. The board wanted the choice to be a decision.
     *
     * The fallback in src/pages/index.astro is the important half of this. With
     * nothing ticked — true on the day this ships, and true again the first
     * time somebody tidies up — the home page returns to the three most recent,
     * so the section a grant reviewer reads can never go blank.
     */
    defineField({
      name: 'featuredOnHome',
      title: 'Feature on the home page',
      type: 'boolean',
      group: 'after',
      initialValue: false,
      description:
        'Puts this write-up on the home page under "What we\'ve done". Only ' +
        'events that have a write-up above can be featured — there is nothing ' +
        'to show otherwise. Each featured event takes a full band across the ' +
        'page, so three or four is what the home page carries comfortably and ' +
        'six is the most it will show. Tick none at all and the home page goes ' +
        'back to showing the three most recent write-ups, so the section is ' +
        'never empty. Changes appear on the site with the next daily build, ' +
        'not straight away.',
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
      archived: 'archived',
      featuredOnHome: 'featuredOnHome',
      recap: 'recap',
    },
    prepare({title, startDate, media, cancelled, archived, featuredOnHome, recap}) {
      /* Pacific, explicitly. The Studio may be open anywhere, and an evening
         event shown a day out is exactly the confusion we are avoiding. */
      const when = startDate
        ? new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Los_Angeles',
            dateStyle: 'medium',
          }).format(new Date(startDate))
        : 'No date'

      /* A list, not a chain of either/ors, because these combine: an archived
         event may also be cancelled, and the editor needs to see both. The two
         that mean "this is not on the site as you would expect" are shouted in
         capitals; the two that are just the normal life cycle are not.

         Without this, an archived event is indistinguishable in the list from a
         live one, and the first symptom is somebody asking why the concert
         vanished from the website. */
      const flags = []
      if (archived) flags.push('ARCHIVED')
      if (cancelled) flags.push('CANCELLED')
      if (recap) flags.push(featuredOnHome ? 'on the home page' : 'written up')

      const status = flags.length ? ` · ${flags.join(' · ')}` : ''

      return {title, subtitle: `${when}${status}`, media}
    },
  },
})
