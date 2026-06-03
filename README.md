# InnCore

InnCore is a full-stack hotel reservation platform developed using **React, Go (Fiber), and MongoDB**, implementing **15+ REST APIs**, JWT authentication, role-based access control, room inventory management, booking lifecycle tracking, and an admin dashboard. Designed a scalable architecture supporting end-to-end hotel discovery, reservation, and user management workflows.

## Features

- JWT-based Authentication
- User Registration & Login
- Browse Hotels with Filtering
- Hotel Ratings & Details
- Room Availability Management
- Room Booking System
- Booking History Tracking
- Booking Cancellation
- Profile Management
- Admin Dashboard
- Database Seeding Support
- Responsive User Interface

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- Lucide React

### Backend

- Go
- Fiber
- MongoDB
- JWT Authentication
- Godotenv

## Project Structure

```text
InnCore/
├── backend/
│   ├── api/
│   ├── db/
│   ├── scripts/
│   ├── types/
│   ├── .env.example
│   ├── Makefile
│   └── main.go
│
└── frontend/
    ├── public/
    ├── src/
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites

Make sure the following are installed:

- Go
- Node.js
- npm
- MongoDB

## Backend Setup

### Clone the Repository

```bash
git clone <repository-url>
cd InnCore
```

### Configure Environment Variables

Inside the `backend` directory, create a `.env` file:

```env
MONGO_DB_URL=mongodb://localhost:27017
MONGO_DB_NAME=inncore
HTTP_LISTEN_ADDRESS=:3000
JWT_SECRET=your_secret_here
```

### Install Dependencies

```bash
go mod tidy
```

### Run the Backend

Using Makefile:

```bash
make run
```

## Seed Demo Data

The project includes a database seeding script that inserts sample users, hotels, rooms, and bookings.

```bash
make seed
```

### Demo Accounts

#### User

```text
Email: james@foo.com
Password: james_foo
```

#### Admin

```text
Email: admin@admin.com
Password: admin_admin
```

---

## Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend/
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## User Workflow

1. Register a new account or sign in.
2. Browse available hotels.
3. View hotel details and available rooms.
4. Select a room and make a booking.
5. Manage bookings from the bookings page.
6. Cancel active reservations if needed.
7. Update profile information.
8. Admin users can access the dashboard to monitor all bookings.

## API Overview

### Authentication

| Method | Endpoint |
|----------|----------|
| POST | `/api/auth` |

### Users

| Method | Endpoint |
|----------|----------|
| POST | `/api/v1/user` |
| GET | `/api/v1/user` |
| GET | `/api/v1/user/:id` |
| PUT | `/api/v1/user/:id` |
| DELETE | `/api/v1/user/:id` |

### Hotels

| Method | Endpoint |
|----------|----------|
| GET | `/api/v1/hotel` |
| GET | `/api/v1/hotel/:id` |
| GET | `/api/v1/hotel/:id/rooms` |

### Rooms

| Method | Endpoint |
|----------|----------|
| GET | `/api/v1/room` |
| POST | `/api/v1/room/:id/book` |

### Bookings

| Method | Endpoint |
|----------|----------|
| GET | `/api/v1/booking/:id` |
| GET | `/api/v1/booking/:id/cancel` |
| GET | `/api/v1/booking/user/:id` |

### Admins

| Method | Endpoint |
|----------|----------|
| GET | `/api/v1/admin/booking` |

## Testing

Run all backend tests:

```bash
make test
```

## Authentication Token

Protected routes require an API token in the request header:

```http
X-Api-Token: <jwt_token>
```

The token is returned after successful authentication.

## Contributing

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes.

```bash
git commit -m "feat: add amazing feature"
```

4. Push to your branch.

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.
