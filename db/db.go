package db

const MongoDBNameEnvName = "MONGO_DB_NAME"

type PaginationFilter struct {
	Page  int64
	Limit int64
}

type Store struct {
	UserStore    UserStore
	HotelStore   HotelStore
	RoomStore    RoomStore
	BookingStore BookingStore
}
