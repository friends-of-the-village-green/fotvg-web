import {defineField, defineType} from 'sanity'

/**
 * A board member or named volunteer.
 *
 * Only people who have agreed to appear. Board composition turns over every
 * year, so keep this to name, role, and a couple of sentences — a page of
 * detailed biographies is a page that goes stale.
 *
 * Never publish anyone's home address or personal phone number. The public
 * contact address for FotVG is the Community Center.
 */
export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'As they spell it. Check — misspelled names are noticed.',
      validation: (Rule) => Rule.required().max(70),
    }),

    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: '"President", "Treasurer", "Greenworks lead".',
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: 'bio',
      title: 'Short biography',
      type: 'text',
      rows: 3,
      description:
        'Two or three sentences at most. Optional — plenty of board members ' +
        'would rather just be named.',
      validation: (Rule) => Rule.max(400),
    }),

    defineField({
      name: 'photo',
      title: 'Photograph',
      type: 'figure',
      description: 'Optional, and only with their agreement.',
    }),

    defineField({
      name: 'order',
      title: 'Position in the list',
      type: 'number',
      description:
        'Lower numbers come first. Use it to put officers above the rest. ' +
        'Leave empty and they sort alphabetically.',
    }),
  ],

  orderings: [
    {
      title: 'Board order',
      name: 'boardOrder',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],

  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo'},
  },
})
