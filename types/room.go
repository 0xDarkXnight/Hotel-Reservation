package types

import "go.mongodb.org/mongo-driver/bson/primitive"

const (
	SingleRoomType RoomType = iota + 1
	DoubleRoomType
	SeaSideRoomType
	DeluxeRoomType
)

type RoomType int

type Room struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Type      RoomType           `bson:"type" json:"type"`
	BasePrice float64            `bson:"basePrice" json:"basePrice"`
	Price     float64            `bson:"price" json:"price"`
	HotelID   primitive.ObjectID `bson:"hotelID" json:"hotelID"`
}
