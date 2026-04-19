package model

type ViewFilter struct {
	WorkspaceID string
	NoteID      string
	ViewIDs     []string
	ViewType    string
	PageSize    int
	PageNumber  int
}

type View struct {
	WorkspaceID string `json:"workspace_id"`
	NoteID      string `json:"note_id"`
	ID          string `json:"id"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	Data        string `json:"data"`
	Visibility  string `json:"visibility"`
	CreatedAt   string `json:"created_at"`
	CreatedBy   string `json:"created_by"`
	UpdatedAt   string `json:"updated_at"`
	UpdatedBy   string `json:"updated_by"`
}
