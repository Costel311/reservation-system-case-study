# MongoDB Data Model for the Reservation Management System

## 1. Overview

This project uses MongoDB as a non-relational, document-oriented database for a reservation management system.

The system manages:

- users
- resources
- time slots
- reservations

The main goal of the database model is to demonstrate how hierarchical and non-relational data structures can be represented in MongoDB.

Unlike a relational database, where users, resources, time slots and reservations would normally be stored in separate normalized tables connected through foreign keys, MongoDB allows related data to be stored in flexible JSON-like documents.

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

### Fields

| Field | Type | Description |
|---|---|---|
| id | string | Application-level user identifier |
| name | string | Full name of the user |
| email | string | Email address |
| role | string | User role: student, teacher, admin or guest |

---

## 5. Resources Collection

The `resources` collection stores reservable resources such as rooms, laboratories or equipment.

This collection demonstrates a hierarchical MongoDB structure because each resource document contains an embedded array of time slots.

### Example document

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
    },
    {
      "id": "slot_2",
      "start": "2026-05-10T10:00:00.000Z",
      "end": "2026-05-10T11:00:00.000Z",
      "isAvailable": true
    }
  ]
}
```

### Fields

| Field | Type | Description |
|---|---|---|
| id | string | Application-level resource identifier |
| name | string | Name of the resource |
| type | string | Resource type: room, laboratory, equipment or other |
| location | string | Physical location |
| capacity | number | Maximum capacity |
| timeSlots | array | Embedded list of available time intervals |

---

## 6. Embedded TimeSlot Structure

A `TimeSlot` is not stored as a separate collection. Instead, it is embedded inside a resource document.

### Example embedded document

```json
{
  "id": "slot_1",
  "start": "2026-05-10T09:00:00.000Z",
  "end": "2026-05-10T10:00:00.000Z",
  "isAvailable": true
}
```

This design is useful because time slots are strongly connected to a specific resource. When the application loads a resource, it also receives the related time slots in the same document.

This is an example of a hierarchical data structure in MongoDB.

---

## 7. Reservations Collection

The `reservations` collection stores confirmed reservations.

A reservation references:

- a user through `userId`
- a resource through `resourceId`
- a time slot through `timeSlotId`

### Example document

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

### Fields

| Field | Type | Description |
|---|---|---|
| id | string | Application-level reservation identifier |
| userId | string | Reference to the user |
| resourceId | string | Reference to the resource |
| timeSlotId | string | Reference to the selected time slot |
| start | string | Reservation start date and time |
| end | string | Reservation end date and time |
| status | string | Reservation status |
| createdAt | string | Date and time when the reservation was created |

---

## 8. Hierarchical and Non-Relational Design

The most important non-relational structure in this project is the `resources` collection.

Each resource contains its own embedded `timeSlots` array:

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

This means that the application does not need a separate `time_slots` table or collection for the basic use case.

The document itself contains a hierarchy:

```txt
Resource
└── TimeSlot[]
    ├── TimeSlot
    └── TimeSlot
```

This structure is suitable for MongoDB because time slots belong directly to resources.

---

## 9. Embedded Documents vs References

The project uses both embedded documents and references.

### Embedded documents

Time slots are embedded inside resources:

```txt
Resource → timeSlots[]
```

This is useful because a time slot has meaning only in relation to a specific resource.

### References

Reservations use references:

```txt
Reservation → userId
Reservation → resourceId
Reservation → timeSlotId
```

This is useful because users and reservations are independent entities and may need to be queried separately.

---

## 10. Reservation Creation Flow

When a reservation is created, the application performs the following steps:

1. Loads users, resources and reservations from MongoDB.
2. Builds an in-memory `SystemState`.
3. Validates the reservation request.
4. Checks if the user exists.
5. Checks if the resource exists.
6. Checks if the selected time slot exists.
7. Checks if the selected time slot is available.
8. Checks if another confirmed reservation already exists for the same resource and time slot.
9. Creates a reservation document.
10. Inserts the reservation into the `reservations` collection.
11. Updates the selected resource by marking the selected time slot as unavailable.

---

## 11. Advantages of the MongoDB Model

The MongoDB model used in this project has several advantages:

- flexible document structure
- natural representation of hierarchical data
- simple storage of resources with embedded time slots
- fewer joins compared to a relational design
- easier mapping between TypeScript objects and MongoDB documents
- good fit for JSON-like application data

---

## 12. Limitations

The model also has limitations:

- embedded arrays may become large if a resource has many time slots
- updating nested fields requires careful update operations
- application-level validation is required to prevent invalid reservations
- references between collections are not automatically enforced by MongoDB like foreign keys in relational databases
- consistency must be handled carefully when reservations and resource availability are updated together

---

## 13. Conclusion

This MongoDB model demonstrates how a reservation management system can be implemented using hierarchical and non-relational data structures.

The `resources` collection stores embedded time slots, while the `reservations` collection references users and resources. This combination of embedded documents and references provides a practical example of document-oriented database design.