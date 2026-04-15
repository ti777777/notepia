import { Node, mergeAttributes } from '@tiptap/core'
import MapEmbedComponent from './MapEmbedComponent'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const MapEmbed = Node.create({
  name: 'mapEmbed',

  group: 'block',
  atom: true,

  addAttributes() {
    return {
      viewId: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'map-embed' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['map-embed', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setMapEmbed:
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
    return ReactNodeViewRenderer(MapEmbedComponent)
  },
})
