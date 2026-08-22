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
   * Four tabs. "Home page" and "Donate and volunteer" are the home page itself,
   * field by field in the order it renders; the other two are the
   * organization's own details and its link previews. Home page opens first —
   * it is what an editor comes here to change, and the reason any of this is in
   * the Studio.
   *
   * The Square links live on the Donate tab rather than with the contact
   * details, which is where they started. They are part of the donation ask, an
   * editor changing the wording of that ask is the person who needs them, and
   * nobody looked for a payment link under "Organization and contact".
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

    /**
     * Its own field rather than a third paragraph of the text above.
     *
     * Two reasons. It is a different thing — the text above says why to give,
     * this asks for a specific amount on top — and separating them means the
     * fee sentence cannot be lost by an editor rewriting the appeal around it.
     */
    defineField({
      name: 'donateFeeText',
      title: 'Donate — covering the card fee',
      type: 'simpleText',
      group: 'give',
      description:
        'The invitation to cover Square\'s processing fee, agreed by the board ' +
        'on 18 August 2026. Square keeps 3.3% plus 30 cents of each card ' +
        'donation, which works out between about 3.6% and 4.5% on the amounts ' +
        'people usually give — so "about 4%" is honest, and worth saying rather ' +
        'than rounding up. Give a worked example or two: "add a few dollars" is ' +
        'twelve percent of a $25 gift and almost nothing on $500. Clear the ' +
        'field to drop the ask entirely.',
      validation: (Rule) =>
        Rule.max(1).warning('One paragraph. Longer and it competes with the appeal above it.'),
    }),

    defineField({
      name: 'donateUrl',
      title: 'Donate — link',
      type: 'url',
      group: 'give',
      description:
        'The Square donation page for a gift to wherever it is needed most. ' +
        'This is the one the Donate button goes to. Donations are handled ' +
        'entirely by Square — no card details ever touch this website. Leave ' +
        'this empty and the Donate buttons do not appear at all, which is ' +
        'better than a button that goes nowhere.',
      validation: (Rule) => Rule.uri({scheme: ['https']}),
    }),

    /**
     * One Square link per program, rather than a "which program?" box on the
     * Square page.
     *
     * Square's custom fields are free text, and the answer reaches the
     * treasurer only by logging in and opening the payment — it is not in the
     * notification email. A payment link's title, by contrast, arrives as the
     * order source on the transaction and in the CSV export, so a separate
     * link per program sorts the money out with no typing and nothing to
     * reconcile by hand. Board decision, 18 August 2026.
     */
    defineField({
      name: 'programDonateLinks',
      title: 'Donate — links to a particular program',
      type: 'array',
      group: 'give',
      description:
        'Optional. A separate Square donation link for each program someone ' +
        'might want to give to directly, shown as small links under the Donate ' +
        'button. Because each Square link carries its own name, the treasurer ' +
        'can tell the funds apart in Square without anyone sorting them by ' +
        'hand — so add one here only when a matching link exists in Square. ' +
        'Two or three is plenty; more turns a simple ask into a decision.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'program',
              title: 'Program',
              type: 'string',
              description:
                'As a donor would recognize it, and the same words as the ' +
                'program page — "Village Green Arts Program", not "VGAP". ' +
                'This is the link text, so it has to make sense read on its own.',
              validation: (Rule) => Rule.required().max(50),
            },
            {
              name: 'url',
              title: 'Square link',
              type: 'url',
              description: 'The Square donation link for this program alone.',
              validation: (Rule) => Rule.required().uri({scheme: ['https']}),
            },
          ],
          preview: {select: {title: 'program', subtitle: 'url'}},
        },
      ],
      validation: (Rule) =>
        Rule.max(4).warning('More than four is a menu, and the band has room for a line.'),
    }),

    defineField({
      name: 'donateByCheck',
      title: 'Donate — other ways to give',
      type: 'simpleText',
      group: 'give',
      description:
        'The small print under the Donate button, for anyone who would rather ' +
        'not use a card. A check costs FotVG nothing at all, which is the ' +
        'reason to mention it, so say that before giving the address. Check ' +
        'with the treasurer before changing the name checks should be made out ' +
        'to — a bank can refuse a check written to an abbreviation.',
      validation: (Rule) =>
        Rule.max(1).warning('One paragraph. This sits in the small print, not the body.'),
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
