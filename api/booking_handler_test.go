package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/0xDarkXnight/Hotel-Reservation-Site/db/fixtures"
	"github.com/0xDarkXnight/Hotel-Reservation-Site/types"
	"github.com/gofiber/fiber/v2"
)

func TestUserGetBooking(t *testing.T) {
	tdb := setup()
	defer tdb.teardown(t)

	var (
		nonAuthUser    = fixtures.AddUser(tdb.Store, "Jimmy", "Watercooler", false)
		user           = fixtures.AddUser(tdb.Store, "james", "foo", false)
		hotel          = fixtures.AddHotel(tdb.Store, "Elysee", "Bermuda", nil, 5)
		room           = fixtures.AddRoom(tdb.Store, "small", true, 99.99, hotel.ID)
		booking        = fixtures.AddBooking(tdb.Store, user.ID, room.ID, 2, time.Now(), time.Now().AddDate(0, 0, 2))
		app            = fiber.New()
		route          = app.Group("/", JWTAuthentication(tdb.Store.UserStore))
		bookingHandler = NewBookingHandler(tdb.Store)
	)
	route.Get("/:id", bookingHandler.HandleGetBooking)
	req := httptest.NewRequest("GET", fmt.Sprintf("/%s", booking.ID.Hex()), nil)
	req.Header.Add("X-Api-Token", CreateTokenFromUser(user))
	resp, err := app.Test(req)
	if err != nil {
		t.Fatal(err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("non 200 code got %d", resp.StatusCode)
	}
	var bookingResp *types.Booking
	if err := json.NewDecoder(resp.Body).Decode(&bookingResp); err != nil {
		t.Fatal(err)
	}
	if bookingResp.ID != booking.ID {
		t.Fatalf("expected %s got %s", booking.ID, bookingResp.ID)
	}
	if bookingResp.UserID != booking.UserID {
		t.Fatalf("expected %s got %s", booking.UserID, bookingResp.UserID)
	}

	req = httptest.NewRequest("GET", fmt.Sprintf("/%s", booking.ID.Hex()), nil)
	req.Header.Add("X-Api-Token", CreateTokenFromUser(nonAuthUser))
	resp, err = app.Test(req)
	if err != nil {
		t.Fatal(err)
	}
	if resp.StatusCode == http.StatusOK {
		t.Fatalf("expected a non 200 status code but got %d", resp.StatusCode)
	}
}

func TestAdminGetBookings(t *testing.T) {
	tdb := setup()
	defer tdb.teardown(t)

	var (
		user           = fixtures.AddUser(tdb.Store, "james", "foo", false)
		adminUser      = fixtures.AddUser(tdb.Store, "admin", "admin", true)
		hotel          = fixtures.AddHotel(tdb.Store, "Elysee", "Bermuda", nil, 5)
		room           = fixtures.AddRoom(tdb.Store, "small", true, 99.99, hotel.ID)
		booking        = fixtures.AddBooking(tdb.Store, user.ID, room.ID, 2, time.Now(), time.Now().AddDate(0, 0, 2))
		app            = fiber.New(fiber.Config{ErrorHandler: ErrorHandler})
		admin          = app.Group("/", JWTAuthentication(tdb.Store.UserStore), AdminAuth)
		bookingHandler = NewBookingHandler(tdb.Store)
	)

	fmt.Println(booking)

	admin.Get("/", bookingHandler.HandleGetBookings)
	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Add("X-Api-Token", CreateTokenFromUser(adminUser))
	resp, err := app.Test(req)
	if err != nil {
		t.Fatal(err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Non 200 response got %d", resp.StatusCode)
	}
	var bookings []*types.Booking
	if err := json.NewDecoder(resp.Body).Decode(&bookings); err != nil {
		t.Fatal(err)
	}
	if len(bookings) != 1 {
		t.Fatalf("expected 1 booking got %d", len(bookings))
	}
	have := bookings[0]
	if have.ID != booking.ID {
		t.Fatalf("expected %s got %s", booking.ID, have.ID)
	}
	if have.UserID != booking.UserID {
		t.Fatalf("expected %s got %s", booking.UserID, have.UserID)
	}
	// test non-admin cannot access the bookings
	req = httptest.NewRequest("GET", "/", nil)
	req.Header.Add("X-Api-Token", CreateTokenFromUser(user))
	resp, err = app.Test(req)
	if err != nil {
		t.Fatal(err)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected status unauthorized but got %d", resp.StatusCode)
	}
}
