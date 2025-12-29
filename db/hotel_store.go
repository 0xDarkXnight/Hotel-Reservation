package db

import (
	"context"
	"os"

	"github.com/0xDarkXnight/Hotel-Reservation-Site/types"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	hotelColl = "hotels"
)

type HotelStore interface {
	GetHotels(context.Context, Map, *PaginationFilter) ([]*types.Hotel, error)
	GetHotelByID(context.Context, string) (*types.Hotel, error)
	InsertHotel(context.Context, *types.Hotel) (*types.Hotel, error)
	UpdateHotelWithRooms(context.Context, Map, Map) error
}

type MongoHotelStore struct {
	client *mongo.Client
	coll   *mongo.Collection
}

func NewMongoHotelStore(client *mongo.Client) *MongoHotelStore {
	mongoDBName := os.Getenv(MongoDBNameEnvName)
	return &MongoHotelStore{
		client: client,
		coll:   client.Database(mongoDBName).Collection(hotelColl),
	}
}

func (s *MongoHotelStore) GetHotels(ctx context.Context, filter Map, pagination *PaginationFilter) ([]*types.Hotel, error) {
	opts := options.FindOptions{}
	opts.SetSkip((pagination.Page - 1) * pagination.Limit)
	opts.SetLimit(pagination.Limit)
	resp, err := s.coll.Find(ctx, filter, &opts)
	if err != nil {
		return nil, err
	}
	var hotels []*types.Hotel
	if err := resp.All(ctx, &hotels); err != nil {
		return nil, err
	}
	return hotels, nil
}

func (s *MongoHotelStore) GetHotelByID(ctx context.Context, id string) (*types.Hotel, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	var hotel *types.Hotel
	if err := s.coll.FindOne(ctx, bson.M{"_id": oid}).Decode(&hotel); err != nil {
		return nil, err
	}
	return hotel, nil
}

func (s *MongoHotelStore) InsertHotel(ctx context.Context, hotel *types.Hotel) (*types.Hotel, error) {
	res, err := s.coll.InsertOne(ctx, hotel)
	if err != nil {
		return nil, err
	}
	hotel.ID = res.InsertedID.(primitive.ObjectID)
	return hotel, nil
}

func (s *MongoHotelStore) UpdateHotelWithRooms(ctx context.Context, filter Map, update Map) error {
	_, err := s.coll.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}
	return nil
}
