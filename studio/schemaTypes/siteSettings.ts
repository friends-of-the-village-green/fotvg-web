import {defineArrayMember, defineField, defineType} from 'sanity'

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

  /**
   * Three tabs, because this document now holds two unrelated kinds of thing:
   * the words across the top of the home page, and the organization's own
   * details. "Home page" opens first — it is the one an editor comes here to
   * change, and the reason it is in the Studio at all.
   */
  groups: [
    {name: 'home', title: 'Home page', default: true},
    {name: 'org', title: 'Organization and contact'},
    {name: 'sharing', title: 'Sharing'},
  ],

  fields: [
    /* ---------------------------------------------------------- home page */

    defineField({
      name: 'heroEyebrow',
      title: 'Small line above the headline',
      type: 'string',
      group: 'home',
      description:
        'The short line in brass capitals at the very top. Leave it empty and ' +
        'the line disappears entirely, which is tidy. Keep it under about 45 ' +
        'characters — it is set in wide capitals and wraps awkwardly.',
      placeholder: 'Village Green Community Center · Kingston',
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: 'heroHeading',
      title: 'Headline',
      type: 'string',
      group: 'home',
      description:
        'The large heading on the home page, and the first thing most visitors ' +
        'read. Short is better — it is set very large, and the design allows ' +
        'about sixteen characters per line before it wraps.',
      placeholder: 'What we help make happen.',
      validation: (Rule) => Rule.max(80),
    }),

    defineField({
      name: 'heroLede',
      title: 'Introduction',
      type: 'array',
      group: 'home',
      description:
        'The paragraph under the headline. Use bold sparingly, for the two ' +
        'things worth catching a skimming eye — that we are Friends of the ' +
        'Village Green, and that we are all-volunteer. One paragraph reads ' +
        'best; two is the most the design holds.',

      /**
       * Deliberately not `blockContent`. Headings, lists and links all belong
       * somewhere on this site, but none of them belong in a hero paragraph —
       * and a control an editor can reach is a control that eventually gets
       * used. Bold is the only thing the hero's styling knows how to render.
       */
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [{title: 'Bold', value: 'strong'}],
            annotations: [],
          },
        }),
      ],

      validation: (Rule) =>
        Rule.max(2).warning('Longer than two paragraphs will crowd the photograph.'),
    }),

    /* ------------------------------------------------------- organization */

    defineField({
      name: 'organizationName',
      title: 'Organization name',
      type: 'string',
      group: 'org',
      description: 'In full. Shown in the header and in link previews.',
      initialValue: 'Friends of the Village Green',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'org',
      description: 'The short line under the name in the header. Keep it under about 40 characters.',
      initialValue: 'Kingston, Washington',
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: 'contactEmail',
      title: 'Public email address',
      type: 'string',
      group: 'org',
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
      group: 'org',
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
      group: 'org',
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
      group: 'org',
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
      name: 'heroImage',
      title: 'Home page photograph',
      type: 'figure',
      group: 'home',
      description:
        'The large photograph across the top of the home page. Chosen by hand ' +
        'rather than picked automatically from the newest event, so the board ' +
        'controls the first thing a visitor sees. Landscape, and the wider the ' +
        'better — it is cropped to a broad band on a big screen. Leave it empty ' +
        'and the header falls back to a plain green panel, which is tidy but ' +
        'much less inviting.',
    }),

    defineField({
      name: 'shareImage',
      title: 'Default sharing image',
      type: 'figure',
      group: 'sharing',
      description:
        'Shown when a link to this site is posted on Facebook or Nextdoor and ' +
        'the page has no picture of its own. Event and program pages use their ' +
        'own photograph, so this is the fallback for the home page and anything ' +
        'without one. Landscape, at least 1200 pixels wide, and it gets cropped ' +
        'to a wide letterbox — so pick something that survives losing the top ' +
        'and bottom, and avoid anything with small text in it.',
    }),
  ],

  preview: {
    prepare: () => ({title: 'Site settings'}),
  },
})
