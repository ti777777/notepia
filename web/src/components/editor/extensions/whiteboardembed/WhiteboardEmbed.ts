import { Node, mergeAttributes } from '@tiptap/core'
import WhiteboardEmbedComponent from './WhiteboardEmbedComponent'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const WhiteboardEmbed = Node.create({
  name: 'whiteboardEmbed',

  group: 'block',
  atom: true,

  addAttributes() {
    return {
      viewId: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'whiteboard-embed' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['whiteboard-embed', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setWhiteboardEmbed:
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
    return ReactNodeViewRenderer(WhiteboardEmbedComponent)
  },
})
