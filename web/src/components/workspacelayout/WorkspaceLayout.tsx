import { useEffect } from "react"
import { useWorkspaceStore } from "@/stores/workspace"
import { Outlet } from "react-router-dom"

const WorkspaceLayout = () => {
    const { isFetched, fetchWorkspaces } = useWorkspaceStore()

    useEffect(() => {
        (async () => {
            if (isFetched) return;
            await fetchWorkspaces();
        })()
    }, [])

    return <Outlet />
}

export default WorkspaceLayout
