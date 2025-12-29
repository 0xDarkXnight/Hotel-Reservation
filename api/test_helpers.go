package api

import (
	"context"
	"log"
	"os"
	"testing"

	"github.com/0xDarkXnight/Hotel-Reservation-Site/db"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type testdb struct {
	client *mongo.Client
	Store  *db.Store
}

func (tdb *testdb) teardown(t *testing.T) {
	mongoDBName := os.Getenv(db.MongoDBNameEnvName)
	if err := tdb.client.Database(mongoDBName).Drop(t.Context()); err != nil {
		t.Fatal(err)
	}
}

func setup() *testdb {
	if err := godotenv.Load("../.env"); err != nil {
		log.Fatal(err)
	}
	mongoDBTestUrl := os.Getenv("MONGO_DB_URL_TEST")
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoDBTestUrl))
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
