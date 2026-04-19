import { Node, mergeAttributes } from '@tiptap/core'
import ViewComponent from './ViewComponent'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ViewType } from '@/types/view'
import { View } from '@/types/view'

export const ViewNode = Node.create({
  name: 'viewNode',

  group: 'block',
  atom: true,

  addOptions() {
    return {
      workspaceId: '',
      noteId: '',
      createView: async (_workspaceId: string, _data: any): Promise<View> => ({ id: '' } as View),
      deleteView: async (_workspaceId: string, _viewId: string): Promise<void> => {},
    }
  },

  addAttributes() {
    return {
      viewId: { default: null },
      viewType: { default: 'map' },
      name: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'view-node' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['view-node', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setViewNode:
        (options: { viewId: string | null; viewType: ViewType; name: string }) =>
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
    return ReactNodeViewRenderer(ViewComponent)
  },
})
