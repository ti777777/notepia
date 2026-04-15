import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { useState } from "react"
import { Sheet, ChevronUp, ChevronDown, ExternalLink, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getView } from "@/api/view"
import useCurrentWorkspaceId from "@/hooks/use-currentworkspace-id"
import SpreadsheetViewComponent from "@/components/views/spreadsheet/SpreadsheetViewComponent"
import ViewBlockPicker from "../viewblockpicker/ViewBlockPicker"

const SheetEmbedComponent: React.FC<NodeViewProps> = ({ node, updateAttributes, selected, editor, deleteNode, getPos }) => {
  const { viewId } = node.attrs
  const workspaceId = useCurrentWorkspaceId()
  const navigate = useNavigate()
  const isEditable = editor.isEditable
  const [showActions, setShowActions] = useState(false)

  const { data: view } = useQuery({
    queryKey: ['view', workspaceId, viewId],
    queryFn: () => getView(workspaceId, viewId!),
    enabled: !!workspaceId && !!viewId,
  })

  const handleMoveUp = () => {
    const pos = getPos()
    if (pos === undefined) return
    const { state } = editor
    const $pos = state.doc.resolve(pos)
    if ($pos.index() === 0) return
    const nodeBefore = $pos.nodeBefore
    if (!nodeBefore) return
    editor.view.dispatch(state.tr.replaceWith(pos - nodeBefore.nodeSize, pos + node.nodeSize, [node, nodeBefore]))
  }

  const handleMoveDown = () => {
    const pos = getPos()
    if (pos === undefined) return
    const { state } = editor
    const $pos = state.doc.resolve(pos)
    if ($pos.index() >= $pos.parent.childCount - 1) return
    const nodeAfterPos = pos + node.nodeSize
    const nodeAfter = state.doc.resolve(nodeAfterPos).nodeAfter
    if (!nodeAfter) return
    editor.view.dispatch(state.tr.replaceWith(pos, nodeAfterPos + nodeAfter.nodeSize, [nodeAfter, node]))
  }

  if (!viewId) {
    return (
      <NodeViewWrapper>
        <ViewBlockPicker
          type="spreadsheet"
          workspaceId={workspaceId}
          icon={<Sheet size={18} />}
          label="Sheet"
          onSelect={(id) => updateAttributes({ viewId: id })}
        />
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper>
      <div
        className={`relative rounded border dark:border-neutral-700 overflow-hidden ${selected ? 'ring-2 ring-blue-500' : ''}`}
        style={{ height: 420 }}
        onMouseEnter={() => isEditable && setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {view && (
          <SpreadsheetViewComponent
            view={view}
            workspaceId={workspaceId}
            viewId={viewId}
          />
        )}

        {isEditable && (showActions || selected) && (
          <div className="absolute top-2 right-2 flex gap-1 z-50">
            <button onClick={handleMoveUp} className="p-2 bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-600 transition-colors" title="Move up">
              <ChevronUp size={16} className="text-gray-700 dark:text-gray-300" />
            </button>
            <button onClick={handleMoveDown} className="p-2 bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-600 transition-colors" title="Move down">
              <ChevronDown size={16} className="text-gray-700 dark:text-gray-300" />
            </button>
            <button onClick={() => navigate(`/workspaces/${workspaceId}/spreadsheet/${viewId}`)} className="p-2 bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-600 transition-colors" title="Open full view">
              <ExternalLink size={16} className="text-gray-700 dark:text-gray-300" />
            </button>
            <button onClick={deleteNode} className="p-2 bg-white dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-600 transition-colors" title="Delete">
              <Trash2 size={16} className="text-red-600 dark:text-red-400" />
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

export default SheetEmbedComponent
