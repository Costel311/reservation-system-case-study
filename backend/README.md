# Reservation System Backend

## 1. Overview

This folder contains the backend part of the reservation management system.

The backend is implemented with:

- Node.js
- Express
- TypeScript
- MongoDB

It runs separately from the frontend and exposes HTTP API endpoints used by the SvelteKit application.

The backend runs by default on:

```txt
http://localhost:3000
```

---

## 2. Purpose

The backend is responsible for:

- connecting to MongoDB
- loading users, resources and reservations
- receiving reservation requests from the frontend
- validating reservation intervals
- checking if the selected interval is inside an availability window
- checking if the selected interval overlaps an existing reservation
- saving valid reservations into MongoDB

This separation makes the project architecture clear:

```txt
SvelteKit frontend
        ↓
Express backend
        ↓
MongoDB database
```

---

## 3. Project Structure

```txt
backend/
├── src/
│   ├── db/
│   │   ├── mongo.ts
│   │   └── state.ts
│   │
│   ├── domain/
│   │   ├── types.ts
│   │   ├── maybe.ts
│   │   ├── validation.ts
│   │   ├── state.ts
│   │   └── reservation.ts
│   │
│   ├── routes/
│   │   ├── users.ts
│   │   ├── resources.ts
│   │   ├── reservations.ts
│   │   └── seed.ts
│   │
│   └── server.ts
│
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 4. API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Backend information |
| `/health` | GET | Checks MongoDB connection |
| `/users` | GET | Returns all users |
| `/resources` | GET | Returns all resources |
| `/reservations` | GET | Returns all reservations |
| `/reservations` | POST | Creates a reservation |
| `/seed` | POST | Inserts sample data into MongoDB |

---

## 5. Reservation Request Format

The frontend sends reservation data to the backend using this format:

```json
{
  "userId": "user_1",
  "resourceId": "resource_1",
  "slot": {
    "start": "2026-05-20T09:30:00.000Z",
    "end": "2026-05-20T10:00:00.000Z"
  }
}
```

The important part is that the frontend sends `start` and `end`, while the backend validates them.

---

## 6. Validation Rules

The backend validates the reservation using the TypeScript domain logic.

A reservation is valid only if:

1. the user exists;
2. the resource exists;
3. the start date is valid;
4. the end date is valid;
5. the start date is before the end date;
6. the requested interval is inside one of the resource availability windows;
7. the requested interval does not overlap an existing confirmed reservation.

---

## 7. MongoDB Data Model

The backend uses the following MongoDB collections:

```txt
users
resources
reservations
```

The most important hierarchical structure is inside the `resources` collection.

Each resource contains embedded availability windows:

```txt
Resource
└── availabilityWindows[]
    ├── TimeSlot
    ├── TimeSlot
    └── TimeSlot
```

This keeps the MongoDB hierarchical data model visible while still allowing users to choose custom start and end values.

---

## 8. Environment Variables

Create a local `.env` file in the `backend` folder:

```txt
backend/.env
```

Example:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=reservation_system
```

The `.env` file is ignored by Git.

The repository contains only:

```txt
backend/.env.example
```

---

## 9. Installation

From the backend folder, install dependencies:

```bash
cd backend
npm install
```

---

## 10. Running the Backend

Start the development server:

```bash
npm run dev
```

The backend will run on:

```txt
http://localhost:3000
```

---

## 11. Seeding the Database

After starting the backend, open another terminal and run:

```powershell
Invoke-RestMethod -Method POST http://localhost:3000/seed
```

This inserts sample users, resources, availability windows and an empty reservations collection.

---

## 12. Testing the Backend

Open these URLs in the browser:

```txt
http://localhost:3000
http://localhost:3000/health
http://localhost:3000/users
http://localhost:3000/resources
http://localhost:3000/reservations
```

To create a reservation from PowerShell:

```powershell
Invoke-RestMethod -Method POST http://localhost:3000/reservations `
  -ContentType "application/json" `
  -Body '{"userId":"user_1","resourceId":"resource_1","slot":{"start":"2026-05-20T09:30:00.000Z","end":"2026-05-20T10:00:00.000Z"}}'
```

---

## 13. Conclusion

The backend separates the server-side logic from the SvelteKit frontend.

It receives reservation requests, validates the selected start and end interval, communicates with MongoDB and saves valid reservations.