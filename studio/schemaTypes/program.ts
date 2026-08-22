import {defineField, defineType} from 'sanity'

import {HEADING_GUIDANCE} from './blockContent'

/**
 * A program area.
 *
 * Three today: Village Green Arts Program, Greenworks, and Community building.
 * The board expects to add more over time, which is the reason this is a
 * document type with pages and slugs rather than a fixed list of options —
 * see decision 011.
 *
 * Greenworks' mission and vision wording is already settled and sits in
 * docs/organization.md. Use it verbatim; it was written by the people who run
 * the garden.
 */
export const program = defineType({
  name: 'program',
  title: 'Program area',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'As the board writes it. "Village Green Arts Program", not "VGAP".',
      validation: (Rule) => Rule.required().max(60),
    }),

    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      description: 'Generated from the name — press Generate. Do not change it once published.',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'summary',
      title: 'One-line summary',
      type: 'text',
      rows: 2,
      description:
        'A sentence, used on the home page and wherever this program is listed. ' +
        '"Arts and humanities. Concerts, and the gallery in the Grand Hallway."',
      validation: (Rule) => Rule.required().max(200),
    }),

    defineField({
      name: 'mission',
      title: 'Mission',
      type: 'text',
      rows: 4,
      description:
        'What this program sets out to do. Optional — only fill it in if the ' +
        'board has actually agreed wording. An invented mission statement is ' +
        'worse than none.',
    }),

    defineField({
      name: 'vision',
      title: 'Vision',
      type: 'text',
      rows: 4,
      description:
        'Where the program hopes to get to. Same rule as the mission: agreed ' +
        'wording only.',
    }),

    defineField({
      name: 'body',
      title: 'About this program',
      type: 'blockContent',
      description:
        'The main text of the program page. What it does, who runs it, how ' +
        'someone gets involved. ' +
        HEADING_GUIDANCE,
    }),

    defineField({
      name: 'image',
      title: 'Main photograph',
      type: 'figure',
      description: 'Shown at the top of the program page. Landscape works best.',
    }),

    defineField({
      name: 'seoDescription',
      title: 'Search description',
      type: 'text',
      rows: 2,
      description: 'Optional. Falls back to the one-line summary, which is usually right.',
      validation: (Rule) => Rule.max(160),
    }),
  ],

  preview: {
    select: {title: 'name', subtitle: 'summary', media: 'image'},
  },
})
