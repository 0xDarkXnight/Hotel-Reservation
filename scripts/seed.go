package main

import (
	"context"
	"fmt"
	"log"

	"github.com/0xDarkXnight/Hotel-Reservation-Site/api"
	"github.com/0xDarkXnight/Hotel-Reservation-Site/db"
	"github.com/0xDarkXnight/Hotel-Reservation-Site/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	client     *mongo.Client
	userStore  db.UserStore
	hotelStore db.HotelStore
	roomStore  db.RoomStore
	ctx        = context.Background()
	err        error
)

func init() {
	client, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(db.DBURI))
	if err != nil {
		log.Fatal(err)
	}
	if err := client.Database(db.DBNAME).Drop(ctx); err != nil {
		log.Fatal(err)
	}
	userStore = db.NewMongoUserStore(client)
	hotelStore = db.NewMongoHotelStore(client)
	roomStore = db.NewMongoRoomStore(client, hotelStore)
}

func seedUser(fname, lname, email, password string, isAdmin bool) {
	user, err := types.NewUserFromParams(types.CreateUserParams{
		FirstName: fname,
		LastName:  lname,
		Email:     email,
		Password:  password,
	})
	if err != nil {
		log.Fatal(err)
	}
	user.IsAdmin = isAdmin
	_, err = userStore.InsertUser(ctx, user)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s -> %s\n", user.Email, api.CreateTokenFromUser(user))
}

func seedHotel(hotelName, hotelLocation string, hotelrating int) {
	hotel := types.Hotel{
		Name:     hotelName,
		Location: hotelLocation,
		Rooms:    []primitive.ObjectID{},
		Rating:   hotelrating,
	}
	rooms := []types.Room{
		{
			Size:  "small",
			Price: 99.9,
		},
		{
			Size:  "medium",
			Price: 149.9,
		},
		{
			Size:  "kingsize",
			Price: 199.9,
		},
	}
	insertedHotel, err := hotelStore.InsertHotel(ctx, &hotel)
	if err != nil {
		log.Fatal(err)
	}
	for _, room := range rooms {
		room.HotelID = insertedHotel.ID
		insertedRoom, err := roomStore.InsertRoom(ctx, &room)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("room -> %s\n", insertedRoom.ID)
	}
}

func main() {
	seedHotel("Bellucia", "France", 3)
	seedHotel("The Cozy Hotel", "Nederlands", 4)
	seedHotel("Taj Hotel", "India", 5)
	seedUser("James", "Hugh", "james@foo.com", "supersecurepassword", false)
	seedUser("admin", "admin", "admin@admin.com", "adminpassword123", true)
}
