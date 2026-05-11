# Application Architecture: SvelteKit Frontend, Express Backend and MongoDB

## 1. Project Overview

This project is a reservation management system developed as a full-stack academic case study.

The application is separated into two main parts:

```txt
frontend/ = SvelteKit application
backend/  = Express + MongoDB API server
```

The main purpose of the project is to demonstrate how hierarchical and non-relational data structures can be used in MongoDB.

The case study focuses on a reservation system where users can reserve different resources or services by selecting a custom start and end interval.

---

## 2. Architectural Overview

The project follows a separated frontend/backend architecture:

```txt
SvelteKit frontend
        ↓ HTTP requests
Express backend
        ↓ MongoDB driver
MongoDB database
```

The frontend does not connect directly to MongoDB.

The backend is responsible for:

- database access;
- validation;
- reservation creation;
- checking availability windows;
- checking overlapping reservations.

This architecture makes the difference between frontend and backend clear.

---

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| SvelteKit | Frontend application |
| Svelte | User interface components |
| Express | Backend HTTP server |
| Node.js | Runtime environment |
| TypeScript | Static typing and domain logic |
| MongoDB | Non-relational document database |
| npm | Package manager |
| GitHub | Version control and public repository hosting |

---

## 4. Project Structure

The project is organized as follows:

```txt
reservation-system-case-study/
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   └── domain/
│   │   │       └── types.ts
│   │   │
│   │   └── routes/
│   │       ├── +page.svelte
│   │       └── reservations/
│   │           └── +page.svelte
│   │
│   ├── package.json
│   ├── README.md
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── mongo.ts
│   │   │   └── state.ts
│   │   │
│   │   ├── domain/
│   │   │   ├── types.ts
│   │   │   ├── maybe.ts
│   │   │   ├── validation.ts
│   │   │   ├── state.ts
│   │   │   └── reservation.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── users.ts
│   │   │   ├── resources.ts
│   │   │   ├── reservations.ts
│   │   │   └── seed.ts
│   │   │
│   │   └── server.ts
│   │
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   └── tsconfig.json
│
├── database/
│   ├── mongodb-model.md
│   └── sample-data.json
│
├── docs/
│   ├── application-architecture.md
│   └── conference-article-sveltekit-mongodb.docx
│
├── README.md
└── .gitignore
```

---

## 5. Frontend Layer

The frontend is located in:

```txt
frontend/
```

It is implemented with SvelteKit and runs on:

```txt
http://localhost:5173
```

The frontend is responsible for the user interface.

It allows users to:

- view available users;
- view available resources;
- view availability windows;
- select a user;
- select a resource;
- choose a start date and time;
- choose an end date and time;
- send a reservation request to the backend;
- view existing reservations.

The frontend does not contain backend API routes.

The frontend does not access MongoDB directly.

---

## 6. Frontend Pages

The main frontend pages are:

```txt
frontend/src/routes/+page.svelte
frontend/src/routes/reservations/+page.svelte
```

The homepage is available at:

```txt
http://localhost:5173
```

The reservations page is available at:

```txt
http://localhost:5173/reservations
```

The reservations page communicates with the backend running on:

```txt
http://localhost:3000
```

---

## 7. Backend Layer

The backend is located in:

```txt
backend/
```

It is implemented with Express, TypeScript and MongoDB.

It runs on:

```txt
http://localhost:3000
```

The backend is responsible for:

- exposing HTTP API endpoints;
- loading data from MongoDB;
- validating reservation requests;
- creating reservations;
- saving reservations in MongoDB;
- preventing invalid intervals;
- preventing overlapping reservations.

---

## 8. Backend API Endpoints

The backend exposes the following endpoints:

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Returns backend information |
| `/health` | GET | Checks MongoDB connection |
| `/users` | GET | Returns all users |
| `/resources` | GET | Returns all resources |
| `/reservations` | GET | Returns all reservations |
| `/reservations` | POST | Creates a reservation |
| `/seed` | POST | Inserts sample data into MongoDB |

---

## 9. Frontend and Backend Communication

The frontend communicates with the backend using HTTP requests.

The frontend loads data with:

```txt
GET http://localhost:3000/users
GET http://localhost:3000/resources
GET http://localhost:3000/reservations
```

The frontend creates reservations with:

```txt
POST http://localhost:3000/reservations
```

The reservation request has this format:

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

The frontend collects the start and end values from the user interface.

The backend receives the request and decides if the reservation is valid.

---

## 10. MongoDB Connection

The MongoDB connection is implemented in:

```txt
backend/src/db/mongo.ts
```

The backend reads MongoDB configuration from:

```txt
backend/.env
```

Example:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=reservation_system
```

The real `.env` file is not uploaded to GitHub.

The public example file is:

```txt
backend/.env.example
```

---

## 11. MongoDB Collections

The application uses three main MongoDB collections:

```txt
users
resources
reservations
```

The database is named:

```txt
reservation_system
```

---

## 12. Users Collection

The `users` collection stores people who can create reservations.

Example:

```json
{
  "id": "user_1",
  "name": "Andrei Popescu",
  "email": "andrei.popescu@example.com",
  "role": "student"
}
```

Supported user roles:

```txt
student
teacher
admin
guest
```

---

## 13. Resources Collection

The `resources` collection stores reservable resources and services.

A resource can be:

- a conference room;
- a laboratory;
- an equipment item;
- a guided tour;
- another reservable item or service.

Each resource contains embedded availability windows.

Example:

```json
{
  "id": "resource_1",
  "name": "Conference Room A",
  "type": "room",
  "location": "Building A, Floor 1",
  "capacity": 20,
  "availabilityWindows": [
    {
      "start": "2026-05-20T09:00:00.000Z",
      "end": "2026-05-20T12:30:00.000Z"
    },
    {
      "start": "2026-05-20T14:00:00.000Z",
      "end": "2026-05-20T17:00:00.000Z"
    }
  ]
}
```

---

## 14. Hierarchical MongoDB Structure

The most important hierarchical structure in this project is found in the `resources` collection.

Each resource contains an embedded array of availability windows:

```txt
Resource
└── availabilityWindows[]
    ├── TimeSlot
    ├── TimeSlot
    └── TimeSlot
```

This shows how MongoDB can store nested data inside a single document.

The embedded availability windows belong directly to the resource.

This is a practical example of hierarchical document modeling.

---

## 15. Reservations Collection

The `reservations` collection stores confirmed reservations.

Example:

```json
{
  "id": "res_123456",
  "userId": "user_1",
  "resourceId": "resource_1",
  "slot": {
    "start": "2026-05-20T09:30:00.000Z",
    "end": "2026-05-20T10:00:00.000Z"
  },
  "status": "confirmed",
  "createdAt": "2026-05-05T20:00:00.000Z"
}
```

A reservation references:

- one user;
- one resource;
- one selected start and end interval.

---

## 16. Domain Logic Layer

The backend contains the main TypeScript domain logic.

It is stored in:

```txt
backend/src/domain/
```

The files are:

| File | Purpose |
|---|---|
| `types.ts` | Defines User, Resource, TimeSlot, Reservation and SystemState |
| `maybe.ts` | Defines Maybe type |
| `validation.ts` | Defines validation result types |
| `state.ts` | Defines StateFn |
| `reservation.ts` | Implements createReservation |

The frontend keeps only the TypeScript types needed for displaying data.

The main reservation logic is now in the backend.

---

## 17. Reservation Validation

The backend validates every reservation request.

A reservation is accepted only if:

1. the user exists;
2. the resource exists;
3. the selected start date is valid;
4. the selected end date is valid;
5. the start date is before the end date;
6. the selected interval is inside one of the resource availability windows;
7. the selected interval does not overlap an existing confirmed reservation.

This makes the backend responsible for the correctness of the reservation process.

---

## 18. Reservation Creation Flow

The reservation creation flow is:

1. The user opens the SvelteKit frontend.
2. The frontend loads users from the backend.
3. The frontend loads resources from the backend.
4. The frontend loads reservations from the backend.
5. The user selects a user.
6. The user selects a resource.
7. The user enters a start date and time.
8. The user enters an end date and time.
9. The frontend sends a POST request to the Express backend.
10. The backend loads the current state from MongoDB.
11. The backend validates the selected interval.
12. The backend creates a reservation if the interval is valid.
13. The backend saves the updated state in MongoDB.
14. The frontend reloads the reservations.

---

## 19. Valid Reservation Example

Resource availability window:

```txt
20 May 2026, 12:00 - 15:30
```

User selected interval:

```txt
20 May 2026, 12:30 - 13:00
```

Result:

```txt
valid
```

The selected interval is inside the availability window.

---

## 20. Invalid Reservation Example

Resource availability window:

```txt
20 May 2026, 12:00 - 15:30
```

User selected interval:

```txt
20 May 2026, 18:00 - 19:00
```

Result:

```txt
invalid
```

The selected interval is outside the availability window.

---

## 21. Overlapping Reservation Example

Existing reservation:

```txt
20 May 2026, 12:30 - 13:00
```

New reservation request:

```txt
20 May 2026, 12:45 - 13:15
```

Result:

```txt
invalid
```

The selected interval overlaps with an existing confirmed reservation.

---

## 22. Sample Resources

The seed data includes the following resources:

| Resource | Type | Description |
|---|---|---|
| Conference Room A | room | Reservable room |
| Conference Room B | room | Reservable room |
| Computer Science Laboratory | laboratory | Academic laboratory |
| Projector Kit | equipment | Presentation equipment |
| Bicycle | equipment | Campus equipment |
| Christmas Tree | equipment | Event object |
| PlayStation | equipment | Recreation equipment |
| DVD | equipment | Media item |
| Guided Building Tour | tour | Scheduled guided service |

The `Guided Building Tour` demonstrates that the system can manage scheduled services, not only physical objects.

---

## 23. Running the Application

The application requires two terminals.

Terminal 1: start the backend.

```bash
cd backend
npm run dev
```

Backend URL:

```txt
http://localhost:3000
```

Terminal 2: start the frontend.

```bash
cd frontend
npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

---

## 24. Seeding the Database

After starting the backend, run:

```powershell
Invoke-RestMethod -Method POST http://localhost:3000/seed
```

This inserts sample users, resources, availability windows and an empty reservations collection.

---

## 25. Testing

Backend URLs:

```txt
http://localhost:3000
http://localhost:3000/health
http://localhost:3000/users
http://localhost:3000/resources
http://localhost:3000/reservations
```

Frontend URLs:

```txt
http://localhost:5173
http://localhost:5173/reservations
```

---

## 26. Conclusion

The current architecture clearly separates frontend and backend.

SvelteKit is used only for the frontend interface.

Express is used for the backend API.

MongoDB stores users, resources, embedded availability windows and reservations.

The project demonstrates hierarchical and non-relational MongoDB data modeling through the embedded `availabilityWindows[]` structure.