CREATE TABLE IF NOT EXISTS view_object_notes (
    view_object_id TEXT,
    note_id TEXT,
    created_at TEXT,
    created_by TEXT,
    PRIMARY KEY (view_object_id, note_id),
    FOREIGN KEY (view_object_id) REFERENCES view_objects(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);
