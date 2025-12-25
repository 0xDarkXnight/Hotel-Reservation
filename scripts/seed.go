package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/0xDarkXnight/Hotel-Reservation-Site/api"
	"github.com/0xDarkXnight/Hotel-Reservation-Site/db"
	"github.com/0xDarkXnight/Hotel-Reservation-Site/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	client       *mongo.Client
	userStore    db.UserStore
	hotelStore   db.HotelStore
	roomStore    db.RoomStore
	bookingStore db.BookingStore
	ctx          = context.Background()
	err          error
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
	bookingStore = db.NewMongoBookingStore(client)
}

func seedUser(fname, lname, email, password string, isAdmin bool) *types.User {
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
	insertedUser, err := userStore.InsertUser(ctx, user)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s -> %s\n", user.Email, api.CreateTokenFromUser(user))
	return insertedUser
}

func seedHotel(hotelName, hotelLocation string, hotelrating int) *types.Hotel {
	hotel := types.Hotel{
		Name:     hotelName,
		Location: hotelLocation,
		Rooms:    []primitive.ObjectID{},
		Rating:   hotelrating,
	}
	insertedHotel, err := hotelStore.InsertHotel(ctx, &hotel)
	if err != nil {
		log.Fatal(err)
	}
	return insertedHotel
}

func seedRoom(size string, seaside bool, price float64, hotelID primitive.ObjectID) *types.Room {
	room := &types.Room{
		Size:    size,
		Seaside: seaside,
		Price:   price,
		HotelID: hotelID,
	}
	insertedRoom, err := roomStore.InsertRoom(ctx, room)
	if err != nil {
		log.Fatal(err)
	}
	return insertedRoom
}

func seedBooking(userID, roomID primitive.ObjectID, numPersons int, fromDate, tillDate time.Time) *types.Booking {
	booking := &types.Booking{
		UserID:     userID,
		RoomID:     roomID,
		NumPersons: numPersons,
		FromDate:   fromDate,
		TillDate:   tillDate,
	}
	insertedBooking, err := bookingStore.InsertBooking(ctx, booking)
	if err != nil {
		log.Fatal(err)
	}
	return insertedBooking
}

func main() {
	james := seedUser("James", "Hugh", "james@foo.com", "supersecurepassword", false)
	seedUser("admin", "admin", "admin@admin.com", "adminpassword123", true)
	seedHotel("Bellucia", "France", 3)
	seedHotel("The Cozy Hotel", "Nederlands", 4)
	hotel := seedHotel("Taj Hotel", "India", 5)
	seedRoom("small", true, 99.99, hotel.ID)
	seedRoom("medium", true, 199.99, hotel.ID)
	room := seedRoom("large", false, 299.99, hotel.ID)
	seedBooking(james.ID, room.ID, 2, time.Now(), time.Now().AddDate(0, 0, 2))
}
