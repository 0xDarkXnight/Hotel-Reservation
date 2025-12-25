package api

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/0xDarkXnight/Hotel-Reservation-Site/db"
	"github.com/0xDarkXnight/Hotel-Reservation-Site/db/fixtures"
	"github.com/0xDarkXnight/Hotel-Reservation-Site/types"
	"github.com/gofiber/fiber/v2"
)

func insertTestUser(t *testing.T, userStore db.UserStore) *types.User {
	user, err := types.NewUserFromParams(types.CreateUserParams{
		FirstName: "James",
		LastName:  "Foo",
		Email:     "james@foo.com",
		Password:  "supersecurepassword",
	})
	if err != nil {
		t.Fatal(err)
	}
	_, err = userStore.InsertUser(context.TODO(), user)
	if err != nil {
		t.Fatal(err)
	}
	return user
}

func TestAuthenticateSuccess(t *testing.T) {
	tdb := setup()
	defer tdb.teardown(t)
	insertedUser := fixtures.AddUser(tdb.Store, "james", "foo", false)
	app := fiber.New()
	authHandler := NewAuthHandler(tdb.Store.UserStore)
	app.Post("/auth", authHandler.HandleAuthenticate)

	authParams := AuthParams{
		Email:    "james@foo.com",
		Password: "james_foo",
	}
	b, _ := json.Marshal(authParams)
	req := httptest.NewRequest("POST", "/auth", bytes.NewReader(b))
	req.Header.Add("Content-Type", "application/json")
	resp, err := app.Test(req)
	if err != nil {
		t.Fatal(err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected http status of 200 but got %d", resp.StatusCode)
	}
	var authResp AuthResponse
	if err := json.NewDecoder(resp.Body).Decode(&authResp); err != nil {
		t.Fatal(err)
	}
	fmt.Println(resp)
	if authResp.Token == "" {
		t.Fatalf("expected the JWT token to be present in the auth response")
	}
	// Set the encrypted password to an empty string, because we do NOT return
	// that in any JSON response.
	insertedUser.EncryptedPassword = ""
	if !reflect.DeepEqual(insertedUser, authResp.User) {
		t.Fatalf("expected user to be the inserted user")
	}
}

func TestAuthenticateWithWrongPasswordFailure(t *testing.T) {
	tdb := setup()
	defer tdb.teardown(t)
	fixtures.AddUser(tdb.Store, "james", "foo", false)
	app := fiber.New()
	authHandler := NewAuthHandler(tdb.Store.UserStore)
	app.Post("/auth", authHandler.HandleAuthenticate)

	authParams := AuthParams{
		Email:    "james@foo.com",
		Password: "supersecurepasswordnotcorrect",
	}
	b, _ := json.Marshal(authParams)
	req := httptest.NewRequest("POST", "/auth", bytes.NewReader(b))
	req.Header.Add("Content-Type", "application/json")
	resp, err := app.Test(req)
	if err != nil {
		t.Fatal(err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected http status of 400 but got %d", resp.StatusCode)
	}
	var genResp genericResp
	if err := json.NewDecoder(resp.Body).Decode(&genResp); err != nil {
		t.Fatal(err)
	}
	if genResp.Type != "error" {
		t.Fatalf("expected gen response type to be error but got %s", genResp.Type)
	}
	if genResp.Msg != "invalid credentials" {
		t.Fatalf("expected gen response msg to be <invalid credentials> but got %s", genResp.Msg)
	}
}
