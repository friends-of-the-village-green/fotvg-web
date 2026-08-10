import {defineField, defineType} from 'sanity'

/**
 * A photograph, with the things a photograph on this site must carry.
 *
 * Alt text is required, everywhere, with no exception. Editors skip it when it
 * is optional, and the accessibility debt builds up silently until someone
 * complains. Making it required costs an editor ten seconds.
 *
 * Before uploading anything, read docs/photos.md. The rules that matter:
 * permission from the photographer must be recorded in writing, identifiable
 * children need written board sign-off, and location data must be stripped from
 * anything shot at a private home *before* upload — Sanity keeps the original
 * file, so stripping it afterwards is too late.
 */
export const figure = defineType({
  name: 'figure',
  title: 'Photograph',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description:
        'Describe what is in the photograph for someone who cannot see it. ' +
        '"A dozen people dancing on the grass in front of the band", not ' +
        '"Music at the Green". Do not start with "Photo of" — a screen reader ' +
        'already says it is an image.',
      validation: (Rule) => Rule.required().max(180),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description:
        'Optional. Only if the picture needs context the surrounding text does ' +
        'not already give. Shown under the photograph.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'credit',
      title: 'Photographer',
      type: 'string',
      description:
        'Who took it. Per photograph, not per batch — a folder of photos from ' +
        'one board member often contains other people\'s work. If you are not ' +
        'sure, find out before publishing rather than guessing.',
    }),
  ],
  preview: {
    select: {media: 'asset', title: 'alt', subtitle: 'credit'},
  },
})
