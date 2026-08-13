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

  /**
   * Four tabs. "Home page" and "Donate and volunteer" are the words on the home
   * page, in the order they appear on it; the other two are the organization's
   * own details and its link previews. Home page opens first — it is what an
   * editor comes here to change, and the reason any of this is in the Studio.
   */
  groups: [
    {name: 'home', title: 'Home page', default: true},
    {name: 'give', title: 'Donate and volunteer'},
    {name: 'org', title: 'Organization and contact'},
    {name: 'sharing', title: 'Sharing'},
  ],

  /**
   * The Home page tab holds three separate blocks of the page, so they are
   * boxed rather than run together as eight loose fields. The top of the page
   * is open because it is edited most often; the other two are collapsed,
   * because they are close to settled.
   */
  fieldsets: [
    {
      name: 'hero',
      title: 'The top of the page',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'supportMore',
      title: 'What we support — the closing note',
      options: {collapsible: true, collapsed: true},
    },
    {
      name: 'notice',
      title: 'Three organizations share the name',
      options: {collapsible: true, collapsed: true},
    },
  ],

  fields: [
    /* -------------------------------------------- home page — top of page */

    defineField({
      name: 'heroEyebrow',
      title: 'Small line above the headline',
      type: 'string',
      group: 'home',
      fieldset: 'hero',
      description:
        'The short line in brass capitals at the very top. Keep it under about ' +
        '45 characters — it is set in wide capitals and wraps awkwardly.',
      placeholder: 'Village Green Community Center · Kingston',
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: 'heroHeading',
      title: 'Headline',
      type: 'string',
      group: 'home',
      fieldset: 'hero',
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
      type: 'simpleText',
      group: 'home',
      fieldset: 'hero',
      description:
        'The paragraph under the headline. Use bold sparingly, for the two ' +
        'things worth catching a skimming eye — that we are Friends of the ' +
        'Village Green, and that we are all-volunteer. One paragraph reads ' +
        'best; two is the most the design holds.',
      validation: (Rule) =>
        Rule.max(2).warning('Longer than two paragraphs will crowd the photograph.'),
    }),

    defineField({
      name: 'heroImage',
      title: 'Home page photograph',
      type: 'figure',
      group: 'home',
      fieldset: 'hero',
      description:
        'The large photograph across the top of the home page. Chosen by hand ' +
        'rather than picked automatically from the newest event, so the board ' +
        'controls the first thing a visitor sees. Landscape, and the wider the ' +
        'better — it is cropped to a broad band on a big screen. Leave it empty ' +
        'and the header falls back to a plain green panel, which is tidy but ' +
        'much less inviting.',
    }),

    /* ----------------------------------- home page — what we support note */

    defineField({
      name: 'supportMoreHeading',
      title: 'Heading',
      type: 'string',
      group: 'home',
      fieldset: 'supportMore',
      description:
        'The last card under "What we support", after the program areas. It is ' +
        'the one card that is not a program — it says the list is expected to ' +
        'grow. It has no page of its own and never links anywhere.',
      placeholder: 'And, we hope, more',
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: 'supportMoreText',
      title: 'Text',
      type: 'simpleText',
      group: 'home',
      fieldset: 'supportMore',
      description:
        'A sentence or two. Keep it about the length of a program summary so ' +
        'the card sits level with the ones beside it.',
      validation: (Rule) => Rule.max(1).warning('One paragraph keeps the cards even.'),
    }),

    /* ------------------------------------ home page — three organizations */

    defineField({
      name: 'disambiguationHeading',
      title: 'Heading',
      type: 'string',
      group: 'home',
      fieldset: 'notice',
      description:
        'The bordered card near the bottom of the home page. Betsy asked for ' +
        'this to be prominent rather than quiet footer text.',
      placeholder: 'Three organizations share the Village Green name',
      validation: (Rule) => Rule.max(90),
    }),

    defineField({
      name: 'disambiguationText',
      title: 'Text',
      type: 'simpleText',
      group: 'home',
      fieldset: 'notice',
      description:
        'Read before editing. Who owns the land, who owns the building and who ' +
        'supports the programs are three different organizations, and the ' +
        'difference is legally and politically real: the Metropolitan Park ' +
        'District owns the land, the Village Green Foundation owns the ' +
        'building, and FotVG supports some of the programs and the people who ' +
        'run them. Rewording this is the easiest way to say something untrue ' +
        'about another organization. Keep bold on the three names, as it is now.',
      validation: (Rule) =>
        Rule.max(2).warning('Two paragraphs is the most the card holds.'),
    }),

    /* ------------------------------------------------ donate and volunteer */

    defineField({
      name: 'donateHeading',
      title: 'Donate — heading',
      type: 'string',
      group: 'give',
      description: 'The heading on the money half of the green band.',
      placeholder: 'Donate',
      validation: (Rule) => Rule.max(40),
    }),

    defineField({
      name: 'donateText',
      title: 'Donate — text',
      type: 'simpleText',
      group: 'give',
      description:
        'Why a donation matters, in concrete terms. The version on the site ' +
        'names what the money actually buys — a musician, seed and timber, the ' +
        'rummage sale — which reads far better than a general appeal. The ' +
        'Donate button, the Square link and the tax note under it are not part ' +
        'of this field and cannot be broken by editing it.',
      validation: (Rule) =>
        Rule.max(2).warning('Two paragraphs is the most the band holds.'),
    }),

    defineField({
      name: 'volunteerHeading',
      title: 'Volunteer — heading',
      type: 'string',
      group: 'give',
      description: 'The heading on the time half of the green band.',
      placeholder: 'Volunteer',
      validation: (Rule) => Rule.max(40),
    }),

    defineField({
      name: 'volunteerText',
      title: 'Volunteer — text',
      type: 'simpleText',
      group: 'give',
      description:
        'What volunteering actually looks like. Specific jobs beat a general ' +
        'appeal — someone can picture setting out chairs before a concert in a ' +
        'way they cannot picture "helping out". Never write "join FotVG": the ' +
        'bylaws state the corporation has no members, so the invitation is to ' +
        'volunteer, donate or come along.',
      validation: (Rule) =>
        Rule.max(2).warning('Two paragraphs is the most the band holds.'),
    }),

    /* -------------------------------------------------------- organization */

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

    /* ------------------------------------------------------------- sharing */

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
