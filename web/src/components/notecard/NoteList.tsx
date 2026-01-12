import { FC } from "react"
import NoteCard from "./NoteCard"
import { NoteData } from "@/api/note"

interface NoteListProps {
    notes: NoteData[]
    getLinkTo?: (note: NoteData) => string
    showLink?: boolean
}

const NoteList: FC<NoteListProps> = ({ notes, getLinkTo, showLink = true }) => {
    return (
        <div className="p-4 flex flex-col gap-2">
            {notes?.map((note: NoteData, idx: number) => {
                if (!note) return null
                return (
                    <NoteCard
                        key={note.id || idx}
                        note={note}
                        linkTo={getLinkTo ? getLinkTo(note) : undefined}
                        showLink={showLink}
                    />
                )
            })}
        </div>
    )
}

export default NoteList