import { Node, mergeAttributes } from '@tiptap/core'
import KanbanEmbedComponent from './KanbanEmbedComponent'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const KanbanEmbed = Node.create({
  name: 'kanbanEmbed',

  group: 'block',
  atom: true,

  addAttributes() {
    return {
      viewId: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'kanban-embed' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['kanban-embed', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setKanbanEmbed:
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
    return ReactNodeViewRenderer(KanbanEmbedComponent)
  },
})
