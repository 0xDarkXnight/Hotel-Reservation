package main

import (
	"context"
	"flag"
	"fmt"
	"log"

	"github.com/0xDarkXnight/Hotel-Reservation-Site/api"
	"github.com/0xDarkXnight/Hotel-Reservation-Site/types"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	dburi    = "mongodb://localhost:27017"
	dbname   = "hotel-reservation"
	userColl = "users"
)

func main() {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(dburi))
	if err != nil {
		log.Fatal(err)
	}
	ctx := context.Background()
	user := types.User{
		FirstName: "James",
		LastName:  "Hugh",
	}
	coll := client.Database(dbname).Collection(userColl)
	res, err := coll.InsertOne(ctx, user)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(res)

	listenAddr := flag.String("listenAddr", ":5000", "The listen address of the API server")
	flag.Parse()

	app := fiber.New()
	apiv1 := app.Group("/api/v1")

	apiv1.Get("/user", api.HandleGetUsers)
	apiv1.Get("/user/:id", api.HandleGetUser)

	app.Listen(*listenAddr)
}
