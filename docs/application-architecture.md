# Application Architecture: SvelteKit + TypeScript + MongoDB

## 1. Project Overview

This project is a reservation management system implemented with SvelteKit, TypeScript and MongoDB.

The application allows users to:

- view available users
- view available resources
- select one of several predefined available time slots
- create reservations
- store reservation data in MongoDB
- update resource availability after a reservation is created

The project was developed as a case study for hierarchical and non-relational data structures in MongoDB.

---

## 2. Technologies Used

| Technology | Purpose |
|---|---|
| SvelteKit | Full-stack web application framework |
| Svelte | User interface components |
| TypeScript | Static typing and domain model definition |
| MongoDB | Non-relational document database |
| Node.js | Runtime environment |
| npm | Package manager |
| GitHub | Version control and public project hosting |

---

## 3. Project Structure

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
│   │   │   └── server/
│   │   │       └── db/
│   │   │           └── mongo.ts
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
├── database/
│   ├── mongodb-model.md
│   └── sample-data.json
├── docs/
│   ├── application-architecture.md
│   └── conference-article-sveltekit-mongodb.docx
└── README.md
```

---

## 4. SvelteKit Application Layer

The SvelteKit application is stored in the `app` folder.

The main interface is implemented using Svelte pages:

```txt
app/src/routes/+page.svelte
app/src/routes/reservations/+page.svelte
```

The reservation page follows a multi-step booking process:

1. select a user
2. select a resource
3. choose one predefined available slot
4. confirm the reservation

---

## 5. API Layer

The backend functionality is implemented using SvelteKit server routes.

| Endpoint | Method | Description |
|---|---|---|
| `/api/users` | GET | Returns all users from MongoDB |
| `/api/resources` | GET | Returns all resources and embedded time slots |
| `/api/reservations` | GET | Returns all reservations |
| `/api/reservations` | POST | Creates a new reservation |
| `/api/seed` | POST | Inserts sample data into MongoDB |

The project does not use a separate Express backend. SvelteKit provides both frontend pages and backend API endpoints.

---

## 6. MongoDB Connection

The MongoDB connection is implemented in:

```txt
app/src/lib/server/db/mongo.ts
```

The required variables are:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=reservation_system
```

The real `.env` file is not uploaded to GitHub.

---

## 7. Domain Logic Layer

The domain logic is separated from the user interface and database layer.

| File | Purpose |
|---|---|
| `types.ts` | Defines User, Resource, TimeSlot, Reservation and SystemState |
| `maybe.ts` | Defines a Maybe type for optional values |
| `validation.ts` | Defines validation result types |
| `state.ts` | Defines StateFn for state transformations |
| `reservation.ts` | Implements the createReservation function |

---

## 8. Resource Types

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

The guided building tour demonstrates that the same reservation system can manage scheduled services, not only physical objects.

---

## 9. Reservation Creation Flow

The reservation creation process works as follows:

1. The user opens the `/reservations` page.
2. The page loads users, resources and reservations from the API.
3. The user selects a user.
4. The user selects a resource.
5. The user chooses one of the predefined available time slots.
6. The page sends a POST request to `/api/reservations`.
7. The API loads the current system state from MongoDB.
8. The `createReservation` function validates the request.
9. If the request is invalid, the API returns validation errors.
10. If the request is valid, a new reservation is created.
11. The reservation is inserted into the `reservations` collection.
12. The selected embedded time slot is marked as unavailable inside the related resource document.
13. The page reloads the updated data.

---

## 10. Relationship Between SvelteKit and MongoDB

SvelteKit handles the application logic and HTTP API. MongoDB stores persistent data.

```txt
Svelte page
   ↓ fetch()
SvelteKit API route
   ↓ connectToDatabase()
MongoDB collection
```

Example:

```txt
/reservations
   ↓
POST /api/reservations
   ↓
createReservation()
   ↓
MongoDB: reservations + resources.timeSlots[]
```

---

## 11. Hierarchical Data Representation

The most important hierarchical structure is the `Resource` document.

Each resource contains an embedded array of `timeSlots`:

```json
{
  "id": "resource_9",
  "name": "Guided Building Tour",
  "type": "tour",
  "timeSlots": [
    {
      "id": "slot_28",
      "start": "2026-06-01T09:00:00.000Z",
      "end": "2026-06-01T10:00:00.000Z",
      "isAvailable": true
    }
  ]
}
```

This structure is naturally represented in MongoDB because documents can contain nested arrays and embedded objects.

---

## 12. Why Predefined Time Slots Are Used

The application uses predefined available intervals instead of allowing users to enter arbitrary `StartDate` and `EndDate` values.

This decision supports two objectives:

1. it follows common online booking behavior, where users select from available offers or intervals;
2. it makes the hierarchical MongoDB model visible through embedded `timeSlots` arrays.

---

## 13. Running the Application

```bash
cd app
npm install
npm run dev
```

The application will be available at:

```txt
http://localhost:5173
```

The reservation page will be available at:

```txt
http://localhost:5173/reservations
```

---

## 14. Seeding the Database

```powershell
Invoke-RestMethod -Method POST http://localhost:5173/api/seed
```

This inserts sample users, resources, predefined time slots and an empty reservations collection.

---

## 15. Conclusion

The application combines SvelteKit and MongoDB in a full-stack TypeScript project.

SvelteKit provides the user interface and API endpoints, while MongoDB stores users, resources, embedded predefined time slots and reservations.

The project demonstrates how hierarchical MongoDB documents can be used in a practical reservation management system.
