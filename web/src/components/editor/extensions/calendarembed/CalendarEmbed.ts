import { Node, mergeAttributes } from '@tiptap/core'
import CalendarEmbedComponent from './CalendarEmbedComponent'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const CalendarEmbed = Node.create({
  name: 'calendarEmbed',

  group: 'block',
  atom: true,

  addAttributes() {
    return {
      viewId: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'calendar-embed' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['calendar-embed', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setCalendarEmbed:
        (options: { viewId: string | null }) =>
        ({ chain }: any) =>
          chain()
            .insertContent({
              type: this.name,
              attrs: options,
            })
            .run(),
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalendarEmbedComponent)
  },
})
