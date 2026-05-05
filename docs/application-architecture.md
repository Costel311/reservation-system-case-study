# Application Architecture: SvelteKit + TypeScript + MongoDB

## 1. Project Overview

This project is a reservation management system implemented with SvelteKit, TypeScript and MongoDB.

The application allows users to:

- view available resources
- view available time slots
- create reservations
- store reservation data in MongoDB
- update resource availability after a reservation is created

The project was developed as a case study for hierarchical and non-relational data structures in MongoDB.

---

## 2. Technologies Used

The project uses the following technologies:

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

The project is organized as follows:

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

The homepage introduces the project and provides access to the reservation page.

The reservation page allows users to:

- select a user
- select a resource
- select an available time slot
- create a reservation
- view available resources
- view existing reservations

---

## 5. API Layer

The backend functionality is implemented using SvelteKit server routes.

The API endpoints are:

| Endpoint | Method | Description |
|---|---|---|
| `/api/users` | GET | Returns all users from MongoDB |
| `/api/resources` | GET | Returns all resources and embedded time slots |
| `/api/reservations` | GET | Returns all reservations |
| `/api/reservations` | POST | Creates a new reservation |
| `/api/seed` | POST | Inserts sample data into MongoDB |

The API routes are implemented in:

```txt
app/src/routes/api/
```

This means that the project does not use a separate Express backend. Instead, SvelteKit provides both frontend pages and backend API endpoints in the same application.

---

## 6. MongoDB Connection

The MongoDB connection is implemented in:

```txt
app/src/lib/server/db/mongo.ts
```

This file reads environment variables from:

```txt
app/.env
```

The required variables are:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=reservation_system
```

The public example file is:

```txt
app/.env.example
```

The real `.env` file is not uploaded to GitHub because it may contain private configuration values.

---

## 7. Domain Logic Layer

The domain logic is separated from the user interface and the database layer.

It is stored in:

```txt
app/src/lib/domain/
```

The domain files are:

| File | Purpose |
|---|---|
| `types.ts` | Defines User, Resource, TimeSlot, Reservation and SystemState |
| `maybe.ts` | Defines a Maybe type for optional values |
| `validation.ts` | Defines validation result types |
| `state.ts` | Defines StateFn for state transformations |
| `reservation.ts` | Implements the createReservation function |

This separation makes the project easier to understand, easier to test and easier to explain in the article.

---

## 8. Reservation Creation Flow

The reservation creation process works as follows:

1. The user opens the `/reservations` page.
2. The page loads users, resources and reservations from the API.
3. The user selects a user, a resource and a time slot.
4. The page sends a POST request to `/api/reservations`.
5. The API loads the current system state from MongoDB.
6. The `createReservation` function validates the request.
7. If the request is invalid, the API returns validation errors.
8. If the request is valid, a new reservation is created.
9. The reservation is inserted into the `reservations` collection.
10. The selected time slot is marked as unavailable inside the related resource document.
11. The page reloads the updated data.

---

## 9. Relationship Between SvelteKit and MongoDB

SvelteKit handles the application logic and the HTTP API.

MongoDB stores the persistent data.

The connection between them is made through server-side API routes:

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
MongoDB: reservations + resources
```

---

## 10. Hierarchical Data Representation

The most important hierarchical structure is the `Resource` document.

Each resource contains an embedded array of `timeSlots`:

```json
{
  "id": "resource_1",
  "name": "Computer Science Laboratory",
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

This structure is naturally represented in MongoDB because documents can contain nested arrays and embedded objects.

---

## 11. Why SvelteKit Is Suitable for This Project

SvelteKit is suitable for this project because it supports:

- frontend pages
- server-side API routes
- TypeScript integration
- simple project structure
- communication with MongoDB from server-side code
- clear separation between UI, API and domain logic

This makes it possible to build the entire reservation system inside one coherent application.

---

## 12. Why MongoDB Is Suitable for This Project

MongoDB is suitable because the reservation system contains data that can be represented as documents.

For example, a resource and its time slots form a natural hierarchy.

Instead of storing time slots in a separate relational table, MongoDB allows them to be embedded inside the resource document.

This approach is useful for this case study because the project focuses on hierarchical and non-relational data structures.

---

## 13. Frontend and Backend Integration

The project uses SvelteKit as a full-stack framework.

The frontend is represented by Svelte pages:

```txt
app/src/routes/+page.svelte
app/src/routes/reservations/+page.svelte
```

The backend is represented by SvelteKit API routes:

```txt
app/src/routes/api/users/+server.ts
app/src/routes/api/resources/+server.ts
app/src/routes/api/reservations/+server.ts
app/src/routes/api/seed/+server.ts
```

The frontend communicates with the backend using `fetch()`:

```txt
fetch('/api/users')
fetch('/api/resources')
fetch('/api/reservations')
```

The backend communicates with MongoDB using the official MongoDB driver.

---

## 14. Environment Configuration

The application uses environment variables to configure the MongoDB connection.

The real environment file is:

```txt
app/.env
```

Example:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=reservation_system
```

The example file uploaded to GitHub is:

```txt
app/.env.example
```

The `.env` file is ignored by Git because it may contain private configuration values.

---

## 15. Running the Application

To run the application locally, the user must first enter the `app` folder:

```bash
cd app
```

Then install dependencies:

```bash
npm install
```

Then start the development server:

```bash
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

## 16. Seeding the Database

The database can be populated with sample data by calling the seed endpoint:

```powershell
Invoke-RestMethod -Method POST http://localhost:5173/api/seed
```

This inserts sample users and resources into MongoDB.

After seeding the database, the application can display users, resources and available time slots.

---

## 17. Conclusion

The application combines SvelteKit and MongoDB in a full-stack TypeScript project.

SvelteKit provides the user interface and API endpoints, while MongoDB stores users, resources, time slots and reservations.

The project demonstrates how hierarchical MongoDB documents can be used in a practical reservation management system.