# Hierarchical and Non-Relational Data Structures in MongoDB: A Reservation Management System Case Study

## 1. Project Overview

This project is a full-stack reservation management system developed as an academic case study for the topic:

**Hierarchical and Non-Relational Data Structures in MongoDB**

The application demonstrates how MongoDB can be used to store and manage hierarchical data structures in a practical software system.

The system allows users to create reservations for different types of resources, while the backend validates the selected interval against the availability data stored in MongoDB.

The project uses:

- SvelteKit for the frontend;
- Express and Node.js for the backend;
- TypeScript for the application logic;
- MongoDB for the non-relational database;
- GitHub for version control and project documentation.

---

## 2. Academic Purpose

The purpose of this project is to demonstrate how hierarchical and non-relational data structures can be used in a real software application.

The case study focuses on a reservation management system where users can reserve different resources, such as:

- conference rooms;
- laboratories;
- equipment;
- bicycles;
- holiday objects;
- entertainment devices;
- media items;
- guided building tours.

The project also demonstrates a clear separation between frontend and backend.

The frontend is responsible for the user interface, while the backend is responsible for validation, database access and reservation creation.

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

All database operations are handled by the backend.

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
│   │   │   └── reservations.ts
│   │   │
│   │   ├── scripts/
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

The main reservation page is available at:

```txt
http://localhost:5173/reservations
```

The frontend is responsible for:

- displaying the homepage;
- displaying the reservation page;
- loading users from the backend;
- loading resources from the backend;
- loading reservations from the backend;
- allowing the user to choose a user;
- allowing the user to choose a resource;
- allowing the user to choose a reservation interval;
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

MongoDB is used because it allows the project to store nested and hierarchical data structures inside documents.

The most important example is the `resources` collection, where each resource contains embedded availability windows.

---

## 9. Users Collection

The `users` collection stores people who can create reservations.

Example document:

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

Each resource contains an embedded array of availability windows.

Example document:

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
- references between collections: `Reservation -> userId`, `resourceId`.

This combination demonstrates a practical non-relational data model.

---

## 12. Reservations Collection

The `reservations` collection stores confirmed reservations.

Example document:

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
  "createdAt": "2026-05-20T08:00:00.000Z"
}
```

A reservation references:

- a user through `userId`;
- a resource through `resourceId`;
- a selected time interval through `slot.start` and `slot.end`.

---

## 13. Reservation Validation

When a user creates a reservation, the frontend sends the following data to the backend:

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

The backend validates whether:

1. the selected user exists;
2. the selected resource exists;
3. the start date is valid;
4. the end date is valid;
5. the start date is before the end date;
6. the selected interval is inside one of the resource availability windows;
7. the selected interval does not overlap an existing confirmed reservation.

If all validations pass, the reservation is saved in MongoDB.

If the reservation is invalid, the backend returns validation errors.

---

## 14. API Endpoints

The backend exposes the following API endpoints:

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Backend information |
| `/health` | GET | Checks backend and MongoDB connection |
| `/users` | GET | Returns all users |
| `/resources` | GET | Returns all resources |
| `/reservations` | GET | Returns all reservations |
| `/reservations` | POST | Creates a new reservation |

The database seed is executed from the terminal using:

```bash
npm run seed
```

The seed is no longer executed by opening `/seed` in the browser.

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
9. The user chooses a reservation interval.
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

Main files:

| File | Purpose |
|---|---|
| `types.ts` | Defines User, Resource, TimeSlot, Reservation and SystemState |
| `maybe.ts` | Defines the Maybe type |
| `validation.ts` | Defines validation result types |
| `state.ts` | Defines the StateFn type |
| `reservation.ts` | Implements reservation creation logic |

The main reservation logic validates the reservation and returns either:

- a valid reservation;
- a list of validation errors.

---

## 17. Environment Configuration

The backend uses a local environment file:

```txt
backend/.env
```

The repository contains an example environment file:

```txt
backend/.env.example
```

Example configuration:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=reservation_system
```

The real `.env` file is ignored by Git and should not be committed.

---

## 18. Prerequisites

Before running the project, make sure the following are installed:

- Node.js;
- npm;
- MongoDB.

MongoDB must be running locally before starting the backend.

---

## 19. Installation and Running the Application

Clone the repository:

```bash
git clone https://github.com/Costel311/reservation-system-case-study.git
cd reservation-system-case-study
```

The project requires two separate terminals:

- one terminal for the backend;
- one terminal for the frontend.

---

### Terminal 1: Backend

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the local environment file:

```bash
copy .env.example .env
```

For macOS or Linux, use:

```bash
cp .env.example .env
```

Seed the database:

```bash
npm run seed
```

Start the backend development server:

```bash
npm run dev
```

The backend will run on:

```txt
http://localhost:3000
```

---

### Terminal 2: Frontend

Open a separate terminal.

From the project root, go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The application can be opened at:

```txt
http://localhost:5173/reservations
```

---

## 20. Backend Test URLs

After starting the backend, the following URLs can be tested in the browser:

```txt
http://localhost:3000
http://localhost:3000/health
http://localhost:3000/users
http://localhost:3000/resources
http://localhost:3000/reservations
```

---

## 21. Frontend Test URLs

After starting the frontend, the following URLs can be tested in the browser:

```txt
http://localhost:5173
http://localhost:5173/reservations
```

The main reservation interface is:

```txt
http://localhost:5173/reservations
```

---

## 22. Important Note About Database Seeding

The database seed is now executed from the terminal using:

```bash
npm run seed
```

It is no longer necessary to open the following URL in the browser:

```txt
http://localhost:3000/seed
```

The seed command inserts sample users, resources, availability windows and reservations into MongoDB.

Correct command:

```bash
npm run seed
```

Old method no longer required:

```txt
http://localhost:3000/seed
```

---

## 23. Example Running Steps

A complete backend run example:

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Then, in a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the application at:

```txt
http://localhost:5173/reservations
```

---

## 24. Documentation

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

## 25. Conference Article

The repository includes a conference article draft in:

```txt
docs/conference-article-sveltekit-mongodb.docx
```

The article presents the project as a case study for hierarchical and non-relational data structures in MongoDB.

---

## 26. Conclusion

This project demonstrates how SvelteKit, Express, TypeScript and MongoDB can be combined into a clearly separated full-stack application.

The frontend handles the user interface.

The backend handles validation and database operations.

MongoDB stores users, resources, embedded availability windows and reservations.

The project is suitable as an academic case study for hierarchical and non-relational MongoDB data modeling.