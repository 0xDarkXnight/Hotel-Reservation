package api

import (
	"github.com/0xDarkXnight/Hotel-Reservation-Site/db"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type HotelHandler struct {
	store *db.Store
}

func NewHotelHandler(store *db.Store) *HotelHandler {
	return &HotelHandler{
		store: store,
	}
}

func (h *HotelHandler) HandleGetHotelRooms(c *fiber.Ctx) error {
	id := c.Params("id")
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return ErrInvalidID()
	}
	filter := db.Map{"hotelID": oid}
	rooms, err := h.store.RoomStore.GetRooms(c.Context(), filter)
	if err != nil {
		return ErrResourceNotFound("rooms")
	}
	return c.JSON(rooms)
}

type ResourceResp struct {
	Results int `json:"result"`
	Data    any `json:"data"`
	Page    int `json:"page"`
}

type HotelQueryParams struct {
	db.PaginationFilter
	Rating int
}

func (h *HotelHandler) HandleGetHotels(c *fiber.Ctx) error {
	var params HotelQueryParams
	if err := c.QueryParser(&params); err != nil {
		return ErrBadRequest()
	}
	var filter db.Map
	filter = db.Map{
		"rating": params.Rating,
	}
	if params.Rating == 0 {
		filter = nil
	}
	hotels, err := h.store.HotelStore.GetHotels(c.Context(), filter, &params.PaginationFilter)
	if err != nil {
		return ErrResourceNotFound("hotels")
	}
	resp := ResourceResp{
		Results: len(hotels),
		Data:    hotels,
		Page:    int(params.Page),
	}
	return c.JSON(resp)
}

func (h *HotelHandler) HandleGetHotel(c *fiber.Ctx) error {
	id := c.Params("id")
	hotel, err := h.store.HotelStore.GetHotelByID(c.Context(), id)
	if err != nil {
		return ErrResourceNotFound("hotel")
	}
	return c.JSON(hotel)
}
