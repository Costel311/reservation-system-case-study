# Hierarchical and Non-Relational Data Structures in MongoDB: A SvelteKit Reservation Management System Case Study

## 1. Project Overview

This project is a full-stack reservation management system developed with **SvelteKit**, **TypeScript** and **MongoDB**.

The project was created as a practical case study for the topic:

**Hierarchical and Non-Relational Data Structures in MongoDB**

The application demonstrates how different types of reservable resources can be modeled using MongoDB documents, embedded arrays and references between collections.

The system allows users to:

- view available users
- view available resources
- choose predefined available time slots
- create reservations
- store reservations in MongoDB
- update resource availability after a reservation is created
- demonstrate hierarchical MongoDB document modeling through embedded `timeSlots`

---

## 2. Academic Purpose

The project supports an academic article about hierarchical and non-relational data structures in MongoDB.

The practical case study is a reservation system where resources contain embedded time slots.

The system can manage different types of resources, such as:

- conference rooms
- laboratories
- equipment
- bicycles
- holiday objects
- entertainment devices
- media items
- guided building tours

This makes the project more flexible and demonstrates that the same MongoDB document model can support both physical resources and scheduled services.

---

## 3. Technologies Used

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

## 4. Repository Structure

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
│   ├── application-architecture.md
│   └── conference-article-sveltekit-mongodb.docx
│
├── README.md
└── .gitignore
```

---

## 5. Main Features

The application includes the following features:

- SvelteKit frontend interface
- SvelteKit backend API routes
- MongoDB database connection
- TypeScript domain model
- reservation validation
- predefined available time slots
- resource availability update after reservation
- seed endpoint for sample data
- MongoDB documentation
- application architecture documentation
- conference article draft

---

## 6. MongoDB Data Model

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

## 7. Users Collection

The `users` collection stores the people who can create reservations.

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

## 8. Resources Collection

The `resources` collection stores reservable items and services.

Each resource contains an embedded array of predefined available time slots.

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

Supported resource types:

```txt
room
laboratory
equipment
tour
other
```

Current sample resources:

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

---

## 9. Reservations Collection

The `reservations` collection stores confirmed reservations.

Example:

```json
{
  "id": "res_123456",
  "userId": "user_1",
  "resourceId": "resource_1",
  "timeSlotId": "slot_1",
  "start": "2026-05-20T09:00:00.000Z",
  "end": "2026-05-20T10:30:00.000Z",
  "status": "confirmed",
  "createdAt": "2026-05-05T20:00:00.000Z"
}
```

A reservation references:

- a user through `userId`
- a resource through `resourceId`
- an embedded time slot through `timeSlotId`

---

## 10. Hierarchical and Non-Relational Structure

The most important hierarchical structure in this project is represented by the `resources` collection.

Each resource contains an embedded array of time slots:

```txt
Resource
└── timeSlots[]
    ├── TimeSlot
    ├── TimeSlot
    └── TimeSlot
```

This structure demonstrates MongoDB hierarchical document modeling.

The project uses both:

- embedded documents: `Resource -> timeSlots[]`
- references: `Reservation -> userId`, `resourceId`, `timeSlotId`

This combination provides a practical example of non-relational data modeling.

---

## 11. Why Predefined Time Slots Are Used

The system uses predefined available time slots instead of allowing completely free date and time selection.

This design was chosen because it is similar to many online booking systems, where users select from a list of available intervals.

It also supports the academic purpose of the project because the time slots are stored as embedded documents inside MongoDB resource documents.

This makes the hierarchical MongoDB structure clear and easy to explain.

---

## 12. SvelteKit Application

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

## 13. API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/users` | GET | Returns all users |
| `/api/resources` | GET | Returns all resources and embedded time slots |
| `/api/reservations` | GET | Returns all reservations |
| `/api/reservations` | POST | Creates a new reservation |
| `/api/seed` | POST | Inserts sample data into MongoDB |

---

## 14. Domain Logic

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

## 15. Environment Configuration

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

## 16. Installation and Running the Project

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

## 17. Seeding the Database

After starting the development server, open a second terminal and run:

```powershell
Invoke-RestMethod -Method POST http://localhost:5173/api/seed
```

This inserts sample users, resources and predefined available time slots into MongoDB.

The seed includes:

- users
- rooms
- laboratory
- equipment
- guided tour resource
- embedded time slots for each resource

After seeding, open:

```txt
http://localhost:5173/reservations
```

---

## 18. Testing the API

The following URLs can be used for testing:

```txt
http://localhost:5173/api/users
http://localhost:5173/api/resources
http://localhost:5173/api/reservations
```

To create a reservation, use the `/reservations` page from the browser.

---

## 19. Reservation Creation Flow

The reservation creation process works as follows:

1. The user opens the `/reservations` page.
2. The page loads users, resources and reservations from the API.
3. The user selects a user.
4. The user selects a resource.
5. The user selects one available predefined time slot.
6. The page sends a POST request to `/api/reservations`.
7. The API loads the current state from MongoDB.
8. The `createReservation` function validates the request.
9. If the request is valid, a new reservation is created.
10. The reservation is inserted into the `reservations` collection.
11. The selected time slot is marked as unavailable in the related resource document.
12. The page reloads the updated data.

---

## 20. Documentation

Additional documentation is available in:

```txt
database/mongodb-model.md
database/sample-data.json
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

## 21. Conference Article

The repository also includes a conference article draft in the `docs` folder:

```txt
docs/conference-article-sveltekit-mongodb.docx
```

The article presents the project as a case study for hierarchical and non-relational data structures in MongoDB.

---

## 22. Conclusion

This reservation management system demonstrates how SvelteKit, TypeScript and MongoDB can be combined to build a full-stack application based on hierarchical and non-relational data structures.

MongoDB is used to store users, resources, embedded time slots and reservations, while SvelteKit provides the user interface and server-side API endpoints.

The project is suitable as a practical academic case study for document-oriented database modeling.