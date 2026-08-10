import {defineField, defineType} from 'sanity'

/**
 * Site-wide settings. There is only ever one of these.
 *
 * The Studio's sidebar is configured to open the single document directly, so
 * an editor cannot accidentally create a second one and then wonder why their
 * change did nothing.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',

  fields: [
    defineField({
      name: 'organizationName',
      title: 'Organization name',
      type: 'string',
      description: 'In full. Shown in the header and in link previews.',
      initialValue: 'Friends of the Village Green',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'The short line under the name in the header. Keep it under about 40 characters.',
      initialValue: 'Kingston, Washington',
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: 'contactEmail',
      title: 'Public email address',
      type: 'string',
      description:
        'The address anyone can write to. A shared or role address, never a ' +
        'board member\'s personal one — board members change and personal ' +
        'inboxes should not become the organization\'s front door.',
      validation: (Rule) => Rule.email(),
    }),

    defineField({
      name: 'postalAddress',
      title: 'Postal address',
      type: 'text',
      rows: 2,
      description:
        'The Village Green Community Center. Never a board member\'s home ' +
        'address, even though that is the registered agent address on the ' +
        'filings — see docs/organization.md.',
      initialValue: 'Village Green Community Center, 26159 Dulay Road NE, Kingston, WA',
    }),

    defineField({
      name: 'donateUrl',
      title: 'Donate link',
      type: 'url',
      description:
        'The Square donation page. Donations are handled entirely by Square — ' +
        'no card details ever touch this website. Leave this empty and the ' +
        'Donate buttons do not appear at all, which is better than a button ' +
        'that goes nowhere.',
      validation: (Rule) => Rule.uri({scheme: ['https']}),
    }),

    defineField({
      name: 'socialLinks',
      title: 'Social media',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Where',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'YouTube', value: 'youtube'},
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'Address',
              type: 'url',
              validation: (Rule) => Rule.required().uri({scheme: ['https']}),
            },
          ],
          preview: {select: {title: 'platform', subtitle: 'url'}},
        },
      ],
    }),

    defineField({
      name: 'shareImage',
      title: 'Default sharing image',
      type: 'figure',
      description:
        'Shown when a link to this site is posted on Facebook or Nextdoor and ' +
        'the page has no picture of its own. Landscape, and at least 1200 ' +
        'pixels wide.',
    }),
  ],

  preview: {
    prepare: () => ({title: 'Site settings'}),
  },
})
