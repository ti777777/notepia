import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import useCurrentWorkspaceId from "@/hooks/use-currentworkspace-id"
import { useEffect, useState, FC } from "react"
import { getNote, NoteData } from "@/api/note"
import { useTranslation } from "react-i18next"
import NoteDetailView from "@/components/notedetail/NoteDetailView"
import { useNoteWebSocket } from "@/hooks/use-note-websocket"

const NoteDetailPage = () => {
    const [note, setNote] = useState<NoteData | null>(null)
    const currentWorkspaceId = useCurrentWorkspaceId()
    const { noteId } = useParams()

    // Connect to WebSocket for real-time collaboration
    const {
        isConnected,
        noteData,
        hasYjsSnapshot,
        title: wsTitle,
        content: wsContent,
        activeUsers,
        sendUpdateTitle,
        yDoc,
        yText
    } = useNoteWebSocket({
        noteId: noteId || '',
        workspaceId: currentWorkspaceId || '',
        enabled: !!noteId && !!currentWorkspaceId
    })

    // Only fetch from REST API if note is NOT initialized (no Y.js snapshot)
    // Once Y.js snapshot exists, use WebSocket data only
    const { data: fetchedNote } = useQuery({
        queryKey: ['note', currentWorkspaceId, noteId],
        queryFn: () => getNote(currentWorkspaceId, noteId!),
        enabled: !!noteId && !!currentWorkspaceId && hasYjsSnapshot === false,
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: true,
    })

    useEffect(() => {
        if (hasYjsSnapshot && noteData) {
            // Note is initialized - use WebSocket data
            setNote(noteData as NoteData | null)
            console.log('[NoteDetailPage] Using WebSocket note data (Y.js initialized)')
        } else if (!hasYjsSnapshot && fetchedNote) {
            // Note is not initialized - use REST API data
            setNote(fetchedNote)
            console.log('[NoteDetailPage] Using REST API note data (not initialized)')
        }
    }, [hasYjsSnapshot, noteData, fetchedNote])

    return (
        <div className="overflow-auto bg-white fixed xl:static top-0 left-0 z-[100] w-screen xl:w-full h-dvh">
            <NoteDetailView
                note={note}
                wsTitle={wsTitle}
                wsContent={wsContent}
                activeUsers={activeUsers}
                isConnected={isConnected}
                onTitleChange={sendUpdateTitle}
                yDoc={yDoc}
                yText={yText}
            />
        </div>
    )
}

export default NoteDetailPage
