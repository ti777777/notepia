import { ReactNode, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getViews, createView } from '@/api/view'
import { ViewType } from '@/types/view'
import { Loader2, Plus } from 'lucide-react'

interface ViewBlockPickerProps {
  type: ViewType
  workspaceId: string
  icon: ReactNode
  label: string
  onSelect: (viewId: string) => void
}

const ViewBlockPicker = ({ type, workspaceId, icon, label, onSelect }: ViewBlockPickerProps) => {
  const queryClient = useQueryClient()
  const [isCreating, setIsCreating] = useState(false)
  const [newViewName, setNewViewName] = useState('')

  const { data: views, isLoading } = useQuery({
    queryKey: ['views', workspaceId, type],
    queryFn: () => getViews(workspaceId, 1, 100, type),
    enabled: !!workspaceId,
  })

  const createMutation = useMutation({
    mutationFn: (name: string) => createView(workspaceId, { name, type }),
    onSuccess: (view) => {
      queryClient.invalidateQueries({ queryKey: ['views', workspaceId, type] })
      onSelect(view.id)
    },
  })

  const handleCreate = () => {
    const name = newViewName.trim() || `New ${label}`
    createMutation.mutate(name)
  }

  return (
    <div className="select-none border dark:border-neutral-700 rounded p-3 bg-gray-100 dark:bg-neutral-800">
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
          <Loader2 size={14} className="animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {views && views.length > 0 && (
            <div className="flex flex-col gap-1 mb-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Select existing:</p>
              {views.map(view => (
                <button
                  key={view.id}
                  onClick={() => onSelect(view.id)}
                  className="w-full text-left px-3 py-2 text-sm rounded bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-500 text-gray-800 dark:text-gray-200 transition-colors"
                >
                  {view.name}
                </button>
              ))}
            </div>
          )}

          {isCreating ? (
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                placeholder={`New ${label} name...`}
                value={newViewName}
                onChange={e => setNewViewName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCreate()
                  if (e.key === 'Escape') setIsCreating(false)
                }}
                className="flex-1 px-3 py-2 text-sm rounded border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="px-3 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : 'Create'}
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-3 py-2 text-sm rounded border border-gray-300 dark:border-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded border border-dashed border-gray-300 dark:border-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-600 dark:text-gray-400 transition-colors w-full"
            >
              <Plus size={14} />
              Create new {label}
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default ViewBlockPicker
