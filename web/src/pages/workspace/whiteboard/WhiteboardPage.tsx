import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { getView } from "@/api/view"
import useCurrentWorkspaceId from "@/hooks/use-currentworkspace-id"
import WhiteboardViewComponent from "@/components/views/whiteboard/WhiteboardViewComponent"
import ViewHeader from "@/components/views/common/ViewHeader"
import OneColumn from "@/components/onecolumn/OneColumn"

const WhiteboardPage = () => {
    const { t } = useTranslation()
    const { whiteboardId } = useParams<{ whiteboardId: string }>()
    const currentWorkspaceId = useCurrentWorkspaceId()

    const { data: view, isLoading: isViewLoading } = useQuery({
        queryKey: ['view', currentWorkspaceId, whiteboardId],
        queryFn: () => getView(currentWorkspaceId, whiteboardId!),
        enabled: !!currentWorkspaceId && !!whiteboardId,
    })

    if (isViewLoading) {
        return <div className="flex justify-center items-center h-screen">{t('common.loading')}</div>
    }

    if (!view) {
        return <div className="flex justify-center items-center h-screen">{t('views.viewNotFound')}</div>
    }

    return (
        <OneColumn>
            <div className="flex flex-col h-screen">
                <ViewHeader
                    viewId={view.id}
                    workspaceId={currentWorkspaceId}
                    viewName={view.name}
                    viewType="whiteboard"
                />
                <div className="flex-1 overflow-hidden">
                    <WhiteboardViewComponent
                        view={view}
                        workspaceId={currentWorkspaceId}
                        viewId={whiteboardId}
                    />
                </div>
            </div>
        </OneColumn>
    )
}

export default WhiteboardPage
