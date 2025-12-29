package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/0xDarkXnight/Hotel-Reservation-Site/api"
	"github.com/0xDarkXnight/Hotel-Reservation-Site/db"
	"github.com/0xDarkXnight/Hotel-Reservation-Site/db/fixtures"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}
	var (
		ctx           = context.Background()
		mongoEndpoint = os.Getenv("MONGO_DB_URL")
		mongoDBName   = os.Getenv("MONGO_DB_NAME")
	)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoEndpoint))
	if err != nil {
		log.Fatal(err)
	}
	if err := client.Database(mongoDBName).Drop(ctx); err != nil {
		log.Fatal(err)
	}
	userStore := db.NewMongoUserStore(client)
	hotelStore := db.NewMongoHotelStore(client)
	roomStore := db.NewMongoRoomStore(client, hotelStore)
	bookingStore := db.NewMongoBookingStore(client)
	store := &db.Store{
		UserStore:    userStore,
		HotelStore:   hotelStore,
		RoomStore:    roomStore,
		BookingStore: bookingStore,
	}
	user := fixtures.AddUser(store, "james", "foo", false)
	fmt.Println("James -> ", api.CreateTokenFromUser(user))
	admin := fixtures.AddUser(store, "admin", "admin", true)
	fmt.Println("Admin -> ", api.CreateTokenFromUser(admin))
	hotel := fixtures.AddHotel(store, "Elysee", "Bermuda", nil, 5)
	room := fixtures.AddRoom(store, "small", true, 99.99, hotel.ID)
	booking := fixtures.AddBooking(store, user.ID, room.ID, 3, time.Now(), time.Now().AddDate(0, 0, 2))
	fmt.Println("booking -> ", booking.ID)

	for i := 0; i < 100; i++ {
		name := fmt.Sprintf("Hotel %d", i+1)
		location := fmt.Sprintf("Location %d", i+1)
		fixtures.AddHotel(store, name, location, nil, rand.Intn(5)+1)
	}
}
