# MongoDB Data Model for the Reservation Management System

## 1. Overview

This project uses MongoDB as a non-relational, document-oriented database for a reservation management system.

The system manages users, resources, predefined available time slots and reservations. The main goal of the database model is to demonstrate how hierarchical and non-relational data structures can be represented in MongoDB.

The current version follows the professor's recommendation: users do not enter arbitrary `StartDate` and `EndDate` values. Instead, they choose one of several predefined available intervals. This is similar to online booking systems, where users select from available offers or time intervals.

---

## 2. Database Name

```txt
reservation_system
```

---

## 3. Collections

The application uses three main MongoDB collections:

```txt
users
resources
reservations
```

---

## 4. Users Collection

The `users` collection stores information about the people who can create reservations.

### Example document

```json
{
  "id": "user_1",
  "name": "Andrei Popescu",
  "email": "andrei.popescu@example.com",
  "role": "student"
}
```

### Supported roles

```txt
student
teacher
admin
guest
```

---

## 5. Resources Collection

The `resources` collection stores all reservable resources and services. Each resource document contains an embedded `timeSlots` array.

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

### Example document

```json
{
  "id": "resource_9",
  "name": "Guided Building Tour",
  "type": "tour",
  "location": "Main Historical Building",
  "capacity": 12,
  "timeSlots": [
    {
      "id": "slot_28",
      "start": "2026-06-01T09:00:00.000Z",
      "end": "2026-06-01T10:00:00.000Z",
      "isAvailable": true
    },
    {
      "id": "slot_29",
      "start": "2026-06-01T11:00:00.000Z",
      "end": "2026-06-01T12:00:00.000Z",
      "isAvailable": true
    }
  ]
}
```

---

## 6. Embedded TimeSlot Structure

A `TimeSlot` is not stored as a separate collection. Instead, it is embedded inside a resource document.

### Example embedded document

```json
{
  "id": "slot_28",
  "start": "2026-06-01T09:00:00.000Z",
  "end": "2026-06-01T10:00:00.000Z",
  "isAvailable": true
}
```

This design is useful because time slots are strongly connected to a specific resource. When the application loads a resource, it also receives all related available intervals in the same document.

This is the main hierarchical structure of the project:

```txt
Resource
└── timeSlots[]
    ├── TimeSlot
    ├── TimeSlot
    └── TimeSlot
```

---

## 7. Reservations Collection

The `reservations` collection stores confirmed reservations.

A reservation references:

- a user through `userId`
- a resource through `resourceId`
- an embedded time slot through `timeSlotId`

### Example document

```json
{
  "id": "res_123456",
  "userId": "user_1",
  "resourceId": "resource_9",
  "timeSlotId": "slot_28",
  "start": "2026-06-01T09:00:00.000Z",
  "end": "2026-06-01T10:00:00.000Z",
  "status": "confirmed",
  "createdAt": "2026-05-05T20:00:00.000Z"
}
```

---

## 8. Embedded Documents vs References

The project uses both embedded documents and references.

### Embedded documents

Time slots are embedded inside resources:

```txt
Resource -> timeSlots[]
```

This is useful because a time slot has meaning only in relation to a specific resource.

### References

Reservations use references:

```txt
Reservation -> userId
Reservation -> resourceId
Reservation -> timeSlotId
```

This is useful because users and reservations are independent entities and may need to be queried separately.

---

## 9. Reservation Creation Flow

When a reservation is created, the application performs the following steps:

1. Loads users, resources and reservations from MongoDB.
2. Builds an in-memory `SystemState`.
3. Validates the reservation request.
4. Checks if the user exists.
5. Checks if the resource exists.
6. Checks if the selected embedded time slot exists.
7. Checks if the selected time slot is available.
8. Checks if another confirmed reservation already exists for the same resource and time slot.
9. Creates a reservation document.
10. Inserts the reservation into the `reservations` collection.
11. Updates the selected resource by marking the selected embedded time slot as unavailable.

---

## 10. Advantages of This MongoDB Model

This model has several advantages:

- clear hierarchical representation through `Resource -> timeSlots[]`
- natural modeling of available intervals
- suitable for online booking-like workflows
- supports both physical resources and scheduled services
- allows the application to load a resource and its available intervals in one document
- combines embedded documents and references in a practical way

---

## 11. Limitations

The model also has limitations:

- embedded arrays may become large if a resource has many time slots
- updating nested fields requires careful update operations
- application-level validation is required to prevent invalid reservations
- references between collections are not automatically enforced like foreign keys in relational databases
- the current version uses predefined intervals rather than fully dynamic calendar scheduling

---

## 12. Conclusion

This MongoDB model demonstrates how a reservation management system can be implemented using hierarchical and non-relational data structures.

The `resources` collection stores embedded predefined time slots, while the `reservations` collection references users, resources and selected time slots. This combination provides a clear practical example of document-oriented database design.
