# SvelteKit Reservation Management Application

## 1. Overview

This folder contains the SvelteKit application for the reservation management system.

The application is built with:

- SvelteKit
- Svelte
- TypeScript
- MongoDB
- Node.js

It provides both the frontend interface and the backend API routes.

The system allows users to select a resource and reserve one of its predefined available time slots.

---

## 2. Main Application Pages

The application contains the following pages:

```txt
src/routes/+page.svelte
src/routes/reservations/+page.svelte
```

The homepage is available at:

```txt
http://localhost:5173
```

The reservations page is available at:

```txt
http://localhost:5173/reservations
```

---

## 3. API Routes

The backend is implemented using SvelteKit server routes.

```txt
src/routes/api/users/+server.ts
src/routes/api/resources/+server.ts
src/routes/api/reservations/+server.ts
src/routes/api/seed/+server.ts
```

Available API endpoints:

| Endpoint | Method | Description |
|---|---|---|
| `/api/users` | GET | Returns all users |
| `/api/resources` | GET | Returns all resources and embedded time slots |
| `/api/reservations` | GET | Returns all reservations |
| `/api/reservations` | POST | Creates a new reservation |
| `/api/seed` | POST | Inserts sample data into MongoDB |

---

## 4. MongoDB Connection

The MongoDB connection is implemented in:

```txt
src/lib/server/db/mongo.ts
```

The application reads MongoDB configuration from:

```txt
.env
```

Example:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=reservation_system
```

The repository contains:

```txt
.env.example
```

The real `.env` file is ignored by Git.

---

## 5. Domain Logic

The TypeScript domain logic is stored in:

```txt
src/lib/domain/
```

Files:

| File | Purpose |
|---|---|
| `types.ts` | Defines User, Resource, TimeSlot, Reservation and SystemState |
| `maybe.ts` | Defines Maybe type |
| `validation.ts` | Defines validation result types |
| `state.ts` | Defines StateFn |
| `reservation.ts` | Implements createReservation |

The domain layer is separated from the UI and from the database layer.

---

## 6. Resource Types

The application supports multiple resource types:

```txt
room
laboratory
equipment
tour
other
```

Current sample resources include:

- Conference Room A
- Conference Room B
- Computer Science Laboratory
- Projector Kit
- Bicycle
- Christmas Tree
- PlayStation
- DVD
- Guided Building Tour

The guided building tour demonstrates that the same reservation model can also be used for scheduled services, not only physical objects.

---

## 7. Time Slot Model

Each resource contains embedded predefined time slots.

Example:

```json
{
  "id": "resource_1",
  "name": "Conference Room A",
  "type": "room",
  "location": "Building A, Floor 1",
  "capacity": 20,
  "timeSlots": [
    {
      "id": "slot_1",
      "start": "2026-05-20T09:00:00.000Z",
      "end": "2026-05-20T10:30:00.000Z",
      "isAvailable": true
    }
  ]
}
```

This embedded structure is important because it demonstrates MongoDB hierarchical document modeling:

```txt
Resource
└── timeSlots[]
    ├── TimeSlot
    ├── TimeSlot
    └── TimeSlot
```

---

## 8. Reservation Flow

The reservation process works as follows:

1. The user opens the reservations page.
2. The application loads users from `/api/users`.
3. The application loads resources from `/api/resources`.
4. The application loads reservations from `/api/reservations`.
5. The user selects a user.
6. The user selects a resource.
7. The user selects one available predefined time slot.
8. The user confirms the reservation.
9. The frontend sends a POST request to `/api/reservations`.
10. The API validates the request using the TypeScript domain logic.
11. The reservation is inserted into MongoDB.
12. The selected embedded time slot is marked as unavailable.
13. The page reloads the updated data.

---

## 9. Installation

From the repository root, enter the app folder:

```bash
cd app
```

Install dependencies:

```bash
npm install
```

---

## 10. Environment Setup

Create a local `.env` file inside the `app` folder:

```txt
app/.env
```

Add:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=reservation_system
```

MongoDB must be running locally before starting the application.

---

## 11. Running the Development Server

Start the application with:

```bash
npm run dev
```

The application will be available at:

```txt
http://localhost:5173
```

---

## 12. Seeding the Database

After starting the development server, open a second terminal and run:

```powershell
Invoke-RestMethod -Method POST http://localhost:5173/api/seed
```

This clears the existing sample data and inserts:

- sample users
- sample resources
- predefined available time slots
- empty reservations collection

The seed endpoint is useful for testing and demonstration.

---

## 13. Testing

Open the following URLs in the browser:

```txt
http://localhost:5173/api/users
http://localhost:5173/api/resources
http://localhost:5173/api/reservations
http://localhost:5173/reservations
```

Then create a reservation from the `/reservations` page.

After a reservation is created, the selected time slot should no longer appear as available for that resource.

---

## 14. Development Notes

The application uses predefined time slots instead of free date and time selection.

This design is intentional because:

- it is similar to many online booking systems
- it makes the reservation process clear
- it demonstrates embedded MongoDB documents
- it keeps the project suitable for an academic case study on hierarchical data structures

---

## 15. Conclusion

This SvelteKit application demonstrates a complete reservation flow using TypeScript and MongoDB.

It combines:

- frontend pages
- backend API routes
- MongoDB persistence
- embedded time slots
- TypeScript domain validation

The result is a full-stack case study for hierarchical and non-relational MongoDB data modeling.