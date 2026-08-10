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
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading', value: 'h2'},
        {title: 'Subheading', value: 'h3'},
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
