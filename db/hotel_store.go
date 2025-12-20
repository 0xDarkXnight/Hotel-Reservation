package db

import (
	"context"

	"github.com/0xDarkXnight/Hotel-Reservation-Site/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	hotelColl = "hotels"
)

type HotelStore interface {
	// GetHotelByID(context.Context, string) (*types.User, error)
	// GetHotels(context.Context) ([]*types.Hotel, error)
	InsertHotel(context.Context, *types.Hotel) (*types.Hotel, error)
	// DeleteHotel(context.Context, string) error
	// UpdateHotel(context.Context, bson.M, types.UpdateHotelParams)
}

type MongoHotelStore struct {
	client *mongo.Client
	coll   *mongo.Collection
}

func NewMongoHotelStore(client *mongo.Client, dbname string) *MongoHotelStore {
	return &MongoHotelStore{
		client: client,
		coll:   client.Database(dbname).Collection(hotelColl),
	}
}

func (s *MongoHotelStore) InsertHotel(ctx context.Context, hotel *types.Hotel) (*types.Hotel, error) {
	res, err := s.coll.InsertOne(ctx, hotel)
	if err != nil {
		return nil, err
	}
	hotel.ID = res.InsertedID.(primitive.ObjectID)
	return hotel, nil
}
