# Hierarchical and Non-Relational Data Structures in MongoDB: A Reservation Management System Case Study

## 1. Project Overview

This project is a reservation management system developed as a full-stack academic case study using:

- SvelteKit for the frontend;
- Express and Node.js for the backend;
- TypeScript for the application logic;
- MongoDB for the non-relational database.

The project was created for the topic:

**Hierarchical and Non-Relational Data Structures in MongoDB**

The application demonstrates how a reservation system can use MongoDB documents, embedded arrays and references between collections.

---

## 2. Academic Purpose

The purpose of this project is to demonstrate how hierarchical and non-relational data structures can be used in a practical software application.

The case study is a reservation management system where users can reserve different types of resources, such as:

- conference rooms;
- laboratories;
- equipment;
- bicycles;
- holiday objects;
- entertainment devices;
- media items;
- guided building tours.

The project also demonstrates a clear separation between frontend and backend, following the model where the Svelte frontend sends reservation data to a separate server endpoint.

---

## 3. Main Architectural Decision

The project is separated into two main applications:

```txt
frontend/ = SvelteKit application
backend/  = Express + MongoDB server
```

This separation makes the architecture clear:

```txt
SvelteKit frontend
        ↓ HTTP requests
Express backend
        ↓ MongoDB driver
MongoDB database
```

The frontend does not connect directly to MongoDB.

The backend is responsible for validation, database access and reservation creation.

---

## 4. Repository Structure

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

## 5. Technologies Used

| Technology | Purpose |
|---|---|
| SvelteKit | Frontend application |
| Svelte | User interface |
| Express | Backend HTTP server |
| Node.js | JavaScript runtime |
| TypeScript | Static typing and domain logic |
| MongoDB | Non-relational document database |
| npm | Package manager |
| GitHub | Version control and public repository hosting |

---

## 6. Frontend

The frontend is located in:

```txt
frontend/
```

It is implemented with SvelteKit and runs on:

```txt
http://localhost:5173
```

The frontend is responsible for:

- displaying the homepage;
- displaying the reservation page;
- loading users from the backend;
- loading resources from the backend;
- loading reservations from the backend;
- allowing the user to choose a start and end interval;
- sending reservation requests to the backend.

The frontend does not contain backend API routes and does not connect directly to MongoDB.

---

## 7. Backend

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

- connecting to MongoDB;
- exposing API endpoints;
- loading users, resources and reservations;
- validating reservation requests;
- checking availability windows;
- checking overlapping reservations;
- saving valid reservations into MongoDB.

---

## 8. MongoDB Database

The MongoDB database is named:

```txt
reservation_system
```

The application uses three main collections:

```txt
users
resources
reservations
```

---

## 9. Users Collection

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

## 10. Resources Collection

The `resources` collection stores reservable resources and services.

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

Supported resource types:

```txt
room
laboratory
equipment
tour
other
```

Sample resources include:

| Resource | Type |
|---|---|
| Conference Room A | room |
| Conference Room B | room |
| Computer Science Laboratory | laboratory |
| Projector Kit | equipment |
| Bicycle | equipment |
| Christmas Tree | equipment |
| PlayStation | equipment |
| DVD | equipment |
| Guided Building Tour | tour |

---

## 11. Hierarchical MongoDB Structure

The most important hierarchical structure is represented by the `resources` collection.

Each resource contains an embedded array of availability windows:

```txt
Resource
└── availabilityWindows[]
    ├── TimeSlot
    ├── TimeSlot
    └── TimeSlot
```

This structure demonstrates how MongoDB can store nested data inside a single document.

The project uses both:

- embedded documents: `Resource -> availabilityWindows[]`;
- references: `Reservation -> userId`, `resourceId`.

This combination demonstrates a practical non-relational data model.

---

## 12. Reservations Collection

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

- a user through `userId`;
- a resource through `resourceId`;
- a selected time interval through `slot.start` and `slot.end`.

---

## 13. Why Start and End Are Selected by the User

The current version allows the user to select a custom start and end interval from the frontend form.

The frontend sends this interval to the backend:

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

The backend then validates whether the selected interval:

1. has a valid start date;
2. has a valid end date;
3. has the start date before the end date;
4. is inside one of the resource availability windows;
5. does not overlap an existing confirmed reservation.

This keeps the reservation process flexible while preserving the hierarchical MongoDB model.

---

## 14. API Endpoints

The backend exposes the following API endpoints:

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

## 15. Reservation Creation Flow

The reservation process works as follows:

1. The backend is started on `http://localhost:3000`.
2. The frontend is started on `http://localhost:5173`.
3. The user opens the reservation page.
4. The frontend loads users from `GET /users`.
5. The frontend loads resources from `GET /resources`.
6. The frontend loads reservations from `GET /reservations`.
7. The user selects a user.
8. The user selects a resource.
9. The user selects a start and end interval.
10. The frontend sends a POST request to `http://localhost:3000/reservations`.
11. The backend loads the current state from MongoDB.
12. The backend validates the reservation request.
13. If the request is valid, the reservation is saved in MongoDB.
14. The frontend reloads the updated reservations.

---

## 16. Domain Logic

The backend contains the main TypeScript domain logic.

The domain layer is stored in:

```txt
backend/src/domain/
```

Files:

| File | Purpose |
|---|---|
| `types.ts` | Defines User, Resource, TimeSlot, Reservation and SystemState |
| `maybe.ts` | Defines Maybe type |
| `validation.ts` | Defines validation result types |
| `state.ts` | Defines StateFn |
| `reservation.ts` | Implements createReservation |

The main function is:

```txt
createReservation
```

It validates the reservation and returns either:

- a valid reservation;
- a list of validation errors.

---

## 17. Environment Configuration

The backend uses a local environment file:

```txt
backend/.env
```

Example:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=reservation_system
```

The real `.env` file is ignored by Git.

The repository contains only:

```txt
backend/.env.example
```

---

## 18. Installation

Clone the repository:

```bash
git clone <repository-url>
cd reservation-system-case-study
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

---

## 19. Running the Full Application

The project requires two terminals.

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

## 20. Seeding the Database

After starting the backend, run:

```powershell
Invoke-RestMethod -Method POST http://localhost:3000/seed
```

This inserts sample users, resources, availability windows and an empty reservations collection.

---

## 21. Testing

Backend test URLs:

```txt
http://localhost:3000
http://localhost:3000/health
http://localhost:3000/users
http://localhost:3000/resources
http://localhost:3000/reservations
```

Frontend test URLs:

```txt
http://localhost:5173
http://localhost:5173/reservations
```

Example valid reservation for Conference Room A:

```txt
Start: 20 May 2026, 12:30
End:   20 May 2026, 13:00
```

This is valid if it is inside the displayed availability window.

Example invalid reservation:

```txt
Start: 20 May 2026, 21:00
End:   20 May 2026, 22:00
```

This is invalid because it is outside the resource availability windows.

---

## 22. Documentation

Additional documentation is available in:

```txt
database/mongodb-model.md
database/sample-data.json
docs/application-architecture.md
```

The documentation explains:

- MongoDB collections;
- embedded availability windows;
- frontend/backend separation;
- reservation validation;
- application architecture.

---

## 23. Conference Article

The repository includes a conference article draft in:

```txt
docs/conference-article-sveltekit-mongodb.docx
```

The article presents the project as a case study for hierarchical and non-relational data structures in MongoDB.

---

## 24. Conclusion

This project demonstrates how SvelteKit, Express, TypeScript and MongoDB can be combined into a clearly separated full-stack application.

The frontend handles the user interface.

The backend handles validation and database operations.

MongoDB stores users, resources, embedded availability windows and reservations.

The project is suitable as an academic case study for hierarchical and non-relational MongoDB data modeling.