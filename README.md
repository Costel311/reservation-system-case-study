# Hierarchical and Non-Relational Data Structures in MongoDB: A Reservation Management System Case Study

## 1. Project Overview

This project is a full-stack reservation management system developed with **SvelteKit**, **TypeScript** and **MongoDB**.

The project was created as a case study for the topic:

**Hierarchical and Non-Relational Data Structures in MongoDB**

The application demonstrates how a reservation system can be modeled using MongoDB documents, embedded arrays and references between collections.

The system allows users to:

- view available resources
- view available time slots
- create reservations
- store reservations in MongoDB
- update resource availability after a reservation is created

---

## 2. Technologies Used

| Technology | Purpose |
|---|---|
| SvelteKit | Full-stack web framework |
| Svelte | User interface |
| TypeScript | Static typing and domain logic |
| MongoDB | Non-relational document database |
| Node.js | JavaScript runtime |
| npm | Package manager |
| GitHub | Version control and public repository hosting |

---

## 3. Repository Structure

```txt
reservation-system-case-study/
├── app/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── domain/
│   │   │   │   ├── types.ts
│   │   │   │   ├── maybe.ts
│   │   │   │   ├── validation.ts
│   │   │   │   ├── state.ts
│   │   │   │   └── reservation.ts
│   │   │   │
│   │   │   └── server/
│   │   │       └── db/
│   │   │           └── mongo.ts
│   │   │
│   │   └── routes/
│   │       ├── +page.svelte
│   │       ├── reservations/
│   │       │   └── +page.svelte
│   │       └── api/
│   │           ├── reservations/
│   │           │   └── +server.ts
│   │           ├── users/
│   │           │   └── +server.ts
│   │           ├── resources/
│   │           │   └── +server.ts
│   │           └── seed/
│   │               └── +server.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── database/
│   ├── mongodb-model.md
│   └── sample-data.json
│
├── docs/
│   └── application-architecture.md
│
├── README.md
└── .gitignore
```

---

## 4. Main Features

The application includes the following features:

- SvelteKit frontend interface
- SvelteKit backend API routes
- MongoDB database connection
- TypeScript domain model
- reservation validation
- resource availability update
- seed endpoint for sample data
- MongoDB documentation
- application architecture documentation

---

## 5. MongoDB Data Model

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

### Users

The `users` collection stores the users who can create reservations.

Example:

```json
{
  "id": "user_1",
  "name": "Andrei Popescu",
  "email": "andrei.popescu@example.com",
  "role": "student"
}
```

### Resources

The `resources` collection stores reservable resources such as rooms, laboratories or equipment.

This collection demonstrates a hierarchical MongoDB structure because each resource document contains embedded time slots.

Example:

```json
{
  "id": "resource_1",
  "name": "Computer Science Laboratory",
  "type": "laboratory",
  "location": "Building A, Room 101",
  "capacity": 30,
  "timeSlots": [
    {
      "id": "slot_1",
      "start": "2026-05-10T09:00:00.000Z",
      "end": "2026-05-10T10:00:00.000Z",
      "isAvailable": true
    }
  ]
}
```

### Reservations

The `reservations` collection stores confirmed reservations.

Example:

```json
{
  "id": "res_123456",
  "userId": "user_1",
  "resourceId": "resource_1",
  "timeSlotId": "slot_1",
  "start": "2026-05-10T09:00:00.000Z",
  "end": "2026-05-10T10:00:00.000Z",
  "status": "confirmed",
  "createdAt": "2026-05-05T20:00:00.000Z"
}
```

More details are available in:

```txt
database/mongodb-model.md
```

---

## 6. Hierarchical and Non-Relational Structure

The main hierarchical structure is represented by the `resources` collection.

Each resource contains an embedded array of time slots:

```txt
Resource
└── TimeSlot[]
    ├── TimeSlot
    └── TimeSlot
```

This is suitable for MongoDB because a resource and its time slots naturally form a document hierarchy.

The project uses both:

- embedded documents: `Resource -> timeSlots[]`
- references: `Reservation -> userId`, `resourceId`, `timeSlotId`

This combination demonstrates a practical non-relational data model.

---

## 7. SvelteKit Application

The SvelteKit application is stored in the `app` folder.

The frontend pages are:

```txt
app/src/routes/+page.svelte
app/src/routes/reservations/+page.svelte
```

The API routes are:

```txt
app/src/routes/api/users/+server.ts
app/src/routes/api/resources/+server.ts
app/src/routes/api/reservations/+server.ts
app/src/routes/api/seed/+server.ts
```

The MongoDB connection utility is:

```txt
app/src/lib/server/db/mongo.ts
```

The TypeScript domain logic is stored in:

```txt
app/src/lib/domain/
```

---

## 8. API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/users` | GET | Returns all users |
| `/api/resources` | GET | Returns all resources and embedded time slots |
| `/api/reservations` | GET | Returns all reservations |
| `/api/reservations` | POST | Creates a new reservation |
| `/api/seed` | POST | Inserts sample data into MongoDB |

---

## 9. Domain Logic

The project separates domain logic from the user interface and database access.

The domain layer contains:

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

It validates:

- if the user exists
- if the resource exists
- if the selected time slot exists
- if the time slot is available
- if the selected time slot is not already reserved

---

## 10. Environment Configuration

The real environment file must be created locally:

```txt
app/.env
```

Example content:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=reservation_system
```

The repository contains only:

```txt
app/.env.example
```

The real `.env` file is ignored by Git.

---

## 11. Installation and Running the Project

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd reservation-system-case-study
```

### Step 2: Enter the SvelteKit application folder

```bash
cd app
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Create the `.env` file

Create a file named:

```txt
app/.env
```

Add:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=reservation_system
```

### Step 5: Start MongoDB locally

MongoDB must be running locally before using the application.

### Step 6: Start the development server

```bash
npm run dev
```

The application will be available at:

```txt
http://localhost:5173
```

The reservations page will be available at:

```txt
http://localhost:5173/reservations
```

---

## 12. Seeding the Database

After starting the development server, open a second terminal and run:

```powershell
Invoke-RestMethod -Method POST http://localhost:5173/api/seed
```

This inserts sample users and resources into MongoDB.

After seeding, open:

```txt
http://localhost:5173/reservations
```

---

## 13. Testing the API

The following URLs can be used for testing:

```txt
http://localhost:5173/api/users
http://localhost:5173/api/resources
http://localhost:5173/api/reservations
```

To create a reservation, use the `/reservations` page from the browser.

---

## 14. Reservation Creation Flow

The reservation creation process works as follows:

1. The user opens the `/reservations` page.
2. The page loads users, resources and reservations from the API.
3. The user selects a user, a resource and a time slot.
4. The page sends a POST request to `/api/reservations`.
5. The API loads the current state from MongoDB.
6. The `createReservation` function validates the request.
7. If the request is valid, a new reservation is created.
8. The reservation is inserted into the `reservations` collection.
9. The selected time slot is marked as unavailable in the related resource document.
10. The page reloads the updated data.

---

## 15. Documentation

Additional documentation is available in:

```txt
database/mongodb-model.md
docs/application-architecture.md
```

The MongoDB documentation explains:

- collections
- embedded documents
- references
- hierarchical data structures
- advantages and limitations of the model

The application architecture documentation explains:

- SvelteKit structure
- API layer
- frontend/backend integration
- MongoDB connection
- domain logic

---

## 16. Academic Purpose

This project was developed for an academic article about:

```txt
Hierarchical and Non-Relational Data Structures in MongoDB
```

The practical case study is a reservation management system implemented with SvelteKit and MongoDB.

The project demonstrates how MongoDB can represent hierarchical data using embedded documents and arrays, while SvelteKit provides the frontend and backend API routes in a single full-stack application.

---

## 17. Conclusion

This reservation management system demonstrates how SvelteKit, TypeScript and MongoDB can be combined to build a full-stack application based on hierarchical and non-relational data structures.

MongoDB is used to store users, resources, time slots and reservations, while SvelteKit provides the user interface and server-side API endpoints.

The project is suitable as a practical case study for document-oriented database modeling.