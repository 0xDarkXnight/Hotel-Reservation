package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/0xDarkXnight/Hotel-Reservation/api"
	"github.com/0xDarkXnight/Hotel-Reservation/db"
	"github.com/0xDarkXnight/Hotel-Reservation/db/fixtures"
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
	hotel1 := fixtures.AddHotel(store, "Hotel Elysee", "Dehradun, Uttarakhand", nil, 4)
	hotel2 := fixtures.AddHotel(store, "Hotel Taj", "Mumbai, Maharashtra", nil, 5)
	hotel3 := fixtures.AddHotel(store, "Hotel Yellow", "Chandigarh, India", nil, 3)
	hotel4 := fixtures.AddHotel(store, "Mariott", "Jaipur, Rajasthan", nil, 5)
	room11 := fixtures.AddRoom(store, "Small Size", false, 149.99, hotel1.ID)
	room12 := fixtures.AddRoom(store, "Medium Size", true, 249.99, hotel1.ID)
	room13 := fixtures.AddRoom(store, "King Size", true, 349.99, hotel1.ID)
	room21 := fixtures.AddRoom(store, "Small Size", false, 199.99, hotel2.ID)
	room22 := fixtures.AddRoom(store, "Medium Size", true, 299.99, hotel2.ID)
	room23 := fixtures.AddRoom(store, "King Size", true, 399.99, hotel2.ID)
	room31 := fixtures.AddRoom(store, "Small Size", false, 99.99, hotel3.ID)
	room32 := fixtures.AddRoom(store, "Medium Size", true, 199.99, hotel3.ID)
	room33 := fixtures.AddRoom(store, "King Size", true, 299.99, hotel3.ID)
	room41 := fixtures.AddRoom(store, "Small Size", false, 199.99, hotel4.ID)
	room42 := fixtures.AddRoom(store, "Medium Size", true, 299.99, hotel4.ID)
	room43 := fixtures.AddRoom(store, "King Size", true, 399.99, hotel4.ID)
	fmt.Println(room11, room12, room13, room21, room22, room23, room31, room32, room33, room41, room42, room43)
}
