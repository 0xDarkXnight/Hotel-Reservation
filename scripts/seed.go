package main

import (
	"context"
	"fmt"
	"log"

	"github.com/0xDarkXnight/Hotel-Reservation-Site/db"
	"github.com/0xDarkXnight/Hotel-Reservation-Site/types"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(db.DBURI))
	if err != nil {
		log.Fatal(err)
	}
	ctx := context.Background()
	hotelStore := db.NewMongoHotelStore(client, db.DBNAME)
	hotel := types.Hotel{
		Name:     "Bellucia",
		Location: "France",
	}

	room := types.Room{
		Type:      types.SingleRoomType,
		BasePrice: 99.9,
	}
	_ = room

	insertedHotel, err := hotelStore.InsertHotel(ctx, &hotel)
	if err != nil {
		log.Fatal(err)
	}
	room.HotelID = insertedHotel.ID

	fmt.Println(insertedHotel)
}
