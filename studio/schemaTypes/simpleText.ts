import {defineArrayMember, defineType} from 'sanity'

/**
 * A short piece of prose: paragraphs and bold, and nothing else.
 *
 * This is the shape used by the blocks of copy on the home page — the hero
 * introduction, the Donate and Volunteer text, and the three-organizations
 * notice. They sit inside a fixed design rather than flowing down a page, and
 * the controls `blockContent` offers would all break that design: a heading
 * inside the green band would compete with the band's own heading, a bulleted
 * list would blow out the two-column grid, and a link would sit next to a
 * button that is already the call to action.
 *
 * Bold survives because it earns its place — it is what lets an editor put
 * weight on "all-volunteer" without asking a developer.
 *
 * Not a replacement for `blockContent`, which is still the right type for the
 * long-form body of an event, a program or a standing page.
 */
export const simpleText = defineType({
  name: 'simpleText',
  title: 'Text',
  type: 'array',
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
})
