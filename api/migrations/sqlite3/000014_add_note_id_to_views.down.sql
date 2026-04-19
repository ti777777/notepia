-- SQLite does not support DROP COLUMN in older versions; recreate table without note_id
CREATE TABLE views_backup AS SELECT workspace_id, id, name, type, data, visibility, created_at, created_by, updated_at, updated_by FROM views;
DROP TABLE views;
ALTER TABLE views_backup RENAME TO views;
