package handler

import (
	"github.com/collabreef/collabreef/internal/db"
	"github.com/collabreef/collabreef/internal/storage"
)

type Handler struct {
	db      db.DB
	storage storage.Storage
}

func NewHandler(r db.DB, s storage.Storage) *Handler {
	return &Handler{
		db:      r,
		storage: s,
	}
}
