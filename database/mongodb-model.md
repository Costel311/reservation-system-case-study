# MongoDB Data Model for the Reservation Management System

## 1. Overview

This document describes the MongoDB data model used by the reservation management system.

The project is implemented as a separated full-stack application:

```txt
SvelteKit frontend
        ↓
Express backend
        ↓
MongoDB database
```

The frontend allows users to select a user, a resource, a start date and an end date.

The backend receives the reservation request, validates the selected interval and stores the reservation in MongoDB.

The database model demonstrates hierarchical and non-relational structures in MongoDB by embedding availability windows inside resource documents.

---

## 2. Database Name

The MongoDB database is named:

```txt
reservation_system
```

---

## 3. Collections

The application uses three main collections:

```txt
users
resources
reservations
```

---

## 4. Users Collection

The `users` collection stores people who can create reservations.

### Example document

```json
{
  "id": "user_1",
  "name": "Andrei Popescu",
  "email": "andrei.popescu@example.com",
  "role": "student"
}
```

### Fields

| Field | Type | Description |
|---|---|---|
| id | string | Application-level user identifier |
| name | string | Full name of the user |
| email | string | Email address |
| role | string | User role |

### Supported user roles

```txt
student
teacher
admin
guest
```

---

## 5. Resources Collection

The `resources` collection stores reservable resources and services.

A resource may represent:

- a room;
- a laboratory;
- an equipment item;
- a guided tour;
- another reservable item or service.

The most important hierarchical structure in the database is found in this collection.

Each resource document contains an embedded array named `availabilityWindows`.

---

## 6. Resource Example

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

## 7. Resource Fields

| Field | Type | Description |
|---|---|---|
| id | string | Application-level resource identifier |
| name | string | Resource name |
| type | string | Resource type |
| location | string | Resource location |
| capacity | number | Maximum capacity |
| availabilityWindows | array | Embedded list of available intervals |

---

## 8. Supported Resource Types

```txt
room
laboratory
equipment
tour
other
```

---

## 9. Current Sample Resources

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

The `Guided Building Tour` resource shows that the same data model can be used not only for physical objects, but also for scheduled services.

---

## 10. Embedded Availability Window Structure

An availability window is embedded inside a resource document.

### Example embedded document

```json
{
  "start": "2026-05-20T09:00:00.000Z",
  "end": "2026-05-20T12:30:00.000Z"
}
```

This structure means that MongoDB stores the availability of a resource inside the resource document itself.

The hierarchy is:

```txt
Resource
└── availabilityWindows[]
    ├── TimeSlot
    ├── TimeSlot
    └── TimeSlot
```

This is an example of hierarchical data modeling in MongoDB.

---

## 11. Why Availability Windows Are Used

The project uses `availabilityWindows[]` instead of a simple hardcoded time slot selected by ID.

This allows the frontend user to choose a custom start and end interval.

For example, the resource may be available during this window:

```txt
20 May 2026, 12:00 - 15:30
```

The user can choose a smaller interval inside that window:

```txt
20 May 2026, 12:30 - 13:00
```

The backend validates whether the selected interval is inside one of the resource availability windows.

This design keeps the system flexible while still preserving the hierarchical MongoDB document structure.

---

## 12. Reservations Collection

The `reservations` collection stores confirmed reservations.

A reservation contains references to:

- the user;
- the resource;
- the selected interval.

### Example document

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

---

## 13. Reservation Fields

| Field | Type | Description |
|---|---|---|
| id | string | Application-level reservation identifier |
| userId | string | Reference to the user |
| resourceId | string | Reference to the resource |
| slot | object | Selected start and end interval |
| status | string | Reservation status |
| createdAt | string | Date and time when the reservation was created |

---

## 14. Embedded Documents vs References

The project uses both embedded documents and references.

### Embedded documents

Availability windows are embedded inside resources:

```txt
Resource -> availabilityWindows[]
```

This is useful because availability windows belong directly to a resource.

### References

Reservations use references:

```txt
Reservation -> userId
Reservation -> resourceId
```

This is useful because users and reservations are independent entities and must be queried separately.

---

## 15. Reservation Validation Flow

When a reservation is created, the backend performs these steps:

1. Receives `userId`, `resourceId` and `slot` from the frontend.
2. Loads users, resources and reservations from MongoDB.
3. Builds an in-memory `SystemState`.
4. Checks if the user exists.
5. Checks if the resource exists.
6. Checks if the selected start and end values are valid dates.
7. Checks if the start date is before the end date.
8. Checks if the selected interval is inside one availability window of the selected resource.
9. Checks if the selected interval overlaps with an existing confirmed reservation.
10. Creates the reservation if all validations pass.
11. Saves the updated state in MongoDB.

---

## 16. Example Valid Reservation

Resource availability window:

```txt
20 May 2026, 12:00 - 15:30
```

Selected reservation interval:

```txt
20 May 2026, 12:30 - 13:00
```

Result:

```txt
valid
```

The selected interval is inside the availability window.

---

## 17. Example Invalid Reservation

Resource availability window:

```txt
20 May 2026, 12:00 - 15:30
```

Selected reservation interval:

```txt
20 May 2026, 18:00 - 19:00
```

Result:

```txt
invalid
```

The selected interval is outside the availability window.

---

## 18. Example Overlapping Reservation

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

## 19. Advantages of This MongoDB Model

The MongoDB model used in this project has several advantages:

- it represents hierarchical data naturally;
- resource availability is stored inside the resource document;
- users can choose custom start and end intervals;
- the backend can validate reservations based on embedded availability windows;
- the model supports different resource types;
- the same structure works for physical resources and scheduled services;
- TypeScript objects map naturally to MongoDB documents.

---

## 20. Limitations

The model also has limitations:

- validation must be implemented at application level;
- MongoDB does not automatically enforce foreign keys;
- overlapping intervals must be checked by backend logic;
- very large availability arrays may require optimization;
- concurrent reservation requests may require stronger transaction handling in a production system.

---

## 21. Conclusion

This MongoDB data model demonstrates how hierarchical and non-relational structures can be used in a reservation management system.

The main hierarchical structure is represented by resources that contain embedded `availabilityWindows[]`.

The reservations collection references users and resources while storing the selected custom interval.

This design preserves MongoDB hierarchical modeling and also supports flexible user-selected start and end reservation intervals.