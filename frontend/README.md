# Reservation System Frontend

## 1. Overview

This folder contains the frontend part of the reservation management system.

The frontend is implemented with:

- SvelteKit
- Svelte
- TypeScript
- Vite

It runs separately from the backend.

The frontend runs by default on:

```txt
http://localhost:5173
```

The backend runs separately on:

```txt
http://localhost:3000
```

---

## 2. Purpose

The frontend is responsible for:

- displaying users;
- displaying resources;
- displaying availability windows;
- allowing the user to select a start and end date;
- sending reservation requests to the Express backend;
- displaying existing reservations.

The frontend does not connect directly to MongoDB.

Instead, it communicates with the backend using HTTP requests.

---

## 3. Project Structure

```txt
frontend/
├── src/
│   ├── lib/
│   │   └── domain/
│   │       └── types.ts
│   │
│   └── routes/
│       ├── +page.svelte
│       └── reservations/
│           └── +page.svelte
│
├── .env.example
├── package.json
└── vite.config.ts
```

---

## 4. Frontend Pages

The application has two main pages:

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

## 5. Backend Communication

The frontend communicates with the backend using the following base URL:

```txt
http://localhost:3000
```

The frontend loads data from:

```txt
GET http://localhost:3000/users
GET http://localhost:3000/resources
GET http://localhost:3000/reservations
```

The frontend creates reservations using:

```txt
POST http://localhost:3000/reservations
```

---

## 6. Reservation Form

The reservation page allows the user to select:

- user;
- resource;
- start date and time;
- end date and time.

The frontend sends this payload to the backend:

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

The frontend does not decide if the reservation is valid.

The backend validates the request.

---

## 7. Availability Windows

Resources contain availability windows.

The user can choose any start and end interval, but the backend accepts the reservation only if the selected interval is inside one of the availability windows.

Example:

```txt
Available window:
20 May 2026, 12:00 - 15:30

Valid reservation:
20 May 2026, 12:30 - 13:00

Invalid reservation:
20 May 2026, 18:00 - 19:00
```

---

## 8. Installation

From the frontend folder, install dependencies:

```bash
cd frontend
npm install
```

---

## 9. Running the Frontend

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on:

```txt
http://localhost:5173
```

---

## 10. Running the Full Application

To run the full project, two servers must be started.

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Then open:

```txt
http://localhost:5173/reservations
```

---

## 11. Conclusion

The frontend is now clearly separated from the backend.

It is responsible only for the user interface and communicates with the Express server through HTTP requests.