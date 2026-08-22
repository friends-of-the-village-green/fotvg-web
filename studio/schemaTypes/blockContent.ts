import {defineArrayMember, defineType} from 'sanity'

/**
 * Rich text.
 *
 * Deliberately small. An editor can write paragraphs, two levels of heading,
 * lists, bold, italic and links — and nothing else.
 *
 * No colour, no font size, no alignment, no heading level 1. Those controls let
 * an editor produce a page the design cannot render, or one that fails a
 * contrast check, and neither failure is visible to the person who caused it.
 * The page supplies its own h1.
 */
/**
 * The sentence every rich-text field carries about headings.
 *
 * Exported and appended rather than repeated, so the four fields cannot drift
 * apart. See HEADING NAMES below for why it is needed at all.
 */
export const HEADING_GUIDANCE =
  'The big title at the top of the page is Heading 1, so start at Heading 2 ' +
  'here. Heading 3 is only for a subsection inside a Heading 2 section — do ' +
  'not jump straight to it. Skipping a level is how a screen reader tells ' +
  'someone they have missed a section.'

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',

      /**
       * HEADING NAMES — numbered, and the numbers are the point.
       *
       * These were "Heading" and "Subheading", which is ambiguous: the page
       * already has a title above the field, so "Heading" reads as though it
       * might be that one, and there is nothing in either name to say which
       * outranks the other.
       *
       * The Studio makes it worse. Its style dropdown previews h2 at Sanity's
       * own default, which is far larger than the 32px this site actually
       * renders body headings at (RichText.astro scopes them down). An editor
       * sizing by eye picks "Subheading" because "Heading" looks enormous —
       * which is exactly what happened on the About us page, where all five
       * section headings went in as h3 and the page skipped a level.
       *
       * Numbers survive a misleading preview: 2 comes before 3 whatever it
       * looks like, and it is the convention from Word and Google Docs. The
       * values are unchanged, so nothing already written moves.
       */
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
      ],
      lists: [
        {title: 'Bulleted list', value: 'bullet'},
        {title: 'Numbered list', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: 'Web address',
                type: 'url',
                description:
                  'Starts with https:// for a website, or mailto: for an email address.',
                validation: (Rule) =>
                  Rule.required().uri({scheme: ['http', 'https', 'mailto']}),
              },
            ],
          },
        ],
      },
    }),
  ],
})
