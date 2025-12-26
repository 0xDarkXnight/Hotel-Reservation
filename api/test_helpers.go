package api

import (
	"context"
	"log"
	"testing"

	"github.com/0xDarkXnight/Hotel-Reservation-Site/db"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	testdburi = "mongodb://localhost:27017"
)

type testdb struct {
	client *mongo.Client
	Store  *db.Store
}

func (tdb *testdb) teardown(t *testing.T) {
	if err := tdb.client.Database(db.DBNAME).Drop(t.Context()); err != nil {
		t.Fatal(err)
	}
}

func setup() *testdb {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(testdburi))
	if err != nil {
		log.Fatal(err)
	}
	hotelStore := db.NewMongoHotelStore(client)
	return &testdb{
		client: client,
		Store: &db.Store{
			UserStore:    db.NewMongoUserStore(client),
			HotelStore:   hotelStore,
			RoomStore:    db.NewMongoRoomStore(client, hotelStore),
			BookingStore: db.NewMongoBookingStore(client),
		},
	}
}
