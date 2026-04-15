import { Node, mergeAttributes } from '@tiptap/core'
import SheetEmbedComponent from './SheetEmbedComponent'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const SheetEmbed = Node.create({
  name: 'sheetEmbed',

  group: 'block',
  atom: true,

  addAttributes() {
    return {
      viewId: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'sheet-embed' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['sheet-embed', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setSheetEmbed:
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
    return ReactNodeViewRenderer(SheetEmbedComponent)
  },
})
