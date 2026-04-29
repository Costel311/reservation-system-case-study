# Reservation System – Studiu de caz TypeScript + MongoDB

## 1. Descriere generală

Acest proiect prezintă un **sistem simplu de rezervări** construit în TypeScript, folosind un model de date funcțional și persistență în MongoDB.

Aplicația permite:

- definirea utilizatorilor;
- definirea resurselor rezervabile;
- crearea unei rezervări pentru o anumită resursă într-un interval de timp;
- validarea existenței utilizatorului;
- validarea existenței resursei;
- verificarea disponibilității resursei;
- salvarea și încărcarea stării aplicației din MongoDB.

Studiul de caz evidențiază folosirea unor concepte precum:

- modelare de domeniu;
- tipuri TypeScript;
- validare funcțională;
- tipuri `Maybe` și `Validation`;
- funcții pure;
- management de stare prin `StateFn`;
- persistență cu MongoDB.

---

## 2. Scopul aplicației

Scopul aplicației este să permită rezervarea unei resurse, de exemplu o sală de conferințe, de către un utilizator existent în sistem.

O rezervare poate fi creată doar dacă:

1. utilizatorul există;
2. resursa există;
3. resursa este disponibilă în intervalul de timp cerut.

Dacă una dintre condiții nu este îndeplinită, aplicația întoarce o eroare de validare și starea sistemului rămâne neschimbată.

---

## 3. Modelul datelor

Modelul de date definește entitățile principale ale aplicației.

```ts
export type ID = string;

export interface User {
  id: ID;
  name: string;
}

export interface Resource {
  id: ID;
  name: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface Reservation {
  id: ID;
  user: ID;
  resource: ID;
  slot: TimeSlot;
  createdAt: Date;
}

export interface SystemState {
  users: Map<ID, User>;
  resources: Map<ID, Resource>;
  reservations: Map<ID, Reservation>;
}

export type StateFn<S, A> = (s: S) => [A, S];
```

### Explicație

| Element | Rol |
|---|---|
| `ID` | Reprezintă identificatorul unic al unei entități. |
| `User` | Reprezintă un utilizator al sistemului. |
| `Resource` | Reprezintă o resursă care poate fi rezervată. |
| `TimeSlot` | Definește intervalul de timp al rezervării. |
| `Reservation` | Reprezintă rezervarea propriu-zisă. |
| `SystemState` | Reprezintă starea completă a aplicației. |
| `StateFn` | Reprezintă o funcție care primește o stare și returnează un rezultat plus o stare nouă. |

---

## 4. Validarea modelului

Pentru validare sunt folosite două tipuri funcționale:

- `Maybe<T>`;
- `Validation<T>`.

Acestea ajută la tratarea sigură a valorilor lipsă și a erorilor.

---

## 5. Tipul `Maybe`

Tipul `Maybe<T>` este folosit atunci când o valoare poate exista sau poate lipsi.

```ts
export type Maybe<T> =
  | { kind: "some"; value: T }
  | { kind: "none" };

export const Maybe = {
  some: <T>(value: T): Maybe<T> => ({ kind: "some", value }),

  none: <T>(): Maybe<T> => ({ kind: "none" }),

  map:
    <A, B>(f: (a: A) => B) =>
    (m: Maybe<A>): Maybe<B> =>
      m.kind === "some" ? Maybe.some(f(m.value)) : Maybe.none()
};
```

### Explicație

`Maybe` este util pentru operații de căutare. De exemplu, când se caută un utilizator după ID, acesta poate fi găsit sau nu.

- Dacă valoarea există, rezultatul este `{ kind: "some", value }`.
- Dacă valoarea nu există, rezultatul este `{ kind: "none" }`.

Acest lucru evită folosirea directă a valorilor `null` sau `undefined`.

---

## 6. Tipul `Validation`

Tipul `Validation<T>` este folosit pentru operații care pot reuși sau pot eșua cu una sau mai multe erori.

```ts
export type Validation<T> =
  | { ok: true; value: T }
  | { ok: false; errors: string[] };

export function isFailure<T>(
  v: Validation<T>
): v is { ok: false; errors: string[] } {
  return v.ok === false;
}

export const Validation = {
  ok: <T>(value: T): Validation<T> => ({ ok: true, value }),

  fail: <T>(...errors: string[]): Validation<T> => ({
    ok: false,
    errors
  }),

  map:
    <A, B>(f: (a: A) => B) =>
    (v: Validation<A>): Validation<B> =>
      isFailure(v)
        ? Validation.fail(...v.errors)
        : Validation.ok(f(v.value))
};
```

### Explicație

`Validation` permite întoarcerea unui rezultat valid sau a unei liste de erori.

Exemple de erori posibile:

- `User not found`;
- `Resource not found`;
- `Resource not available`.

---

## 7. Logica aplicației

Logica aplicației este responsabilă de:

- căutarea entităților;
- verificarea existenței utilizatorului;
- verificarea existenței resursei;
- verificarea disponibilității;
- crearea unei rezervări.

---

## 8. Funcția `lookup`

```ts
export const lookup =
  <A>(m: Map<ID, A>) =>
  (id: ID): Maybe<A> =>
    m.has(id) ? Maybe.some(m.get(id)!) : Maybe.none();
```

### Explicație

Funcția `lookup` caută o valoare într-un `Map`, folosind un ID.

Dacă valoarea există, se returnează `Maybe.some`. Dacă nu există, se returnează `Maybe.none`.

---

## 9. Funcția `require`

```ts
export const require =
  <A>(err: string) =>
  (m: Maybe<A>): Validation<A> =>
    m.kind === "some" ? Validation.ok(m.value) : Validation.fail(err);
```

### Explicație

Funcția `require` transformă un rezultat de tip `Maybe` într-un rezultat de tip `Validation`.

Dacă valoarea există, validarea reușește. Dacă valoarea lipsește, validarea eșuează cu mesajul primit ca parametru.

---

## 10. Verificarea existenței utilizatorului și resursei

```ts
export const ensureUserExists =
  (id: ID) =>
  (state: SystemState) =>
    require("User not found")(lookup(state.users)(id));

export const ensureResourceExists =
  (id: ID) =>
  (state: SystemState) =>
    require("Resource not found")(lookup(state.resources)(id));
```

### Explicație

Aceste funcții verifică dacă un utilizator sau o resursă există în starea curentă a sistemului.

Dacă entitatea există, se returnează un rezultat valid. Dacă nu există, se returnează o eroare.

---

## 11. Verificarea disponibilității resursei

```ts
export const isAvailable =
  (slot: TimeSlot, resourceId: ID) =>
  (state: SystemState): boolean =>
    [...state.reservations.values()].every(
      r =>
        r.resource !== resourceId ||
        r.slot.end <= slot.start ||
        r.slot.start >= slot.end
    );
```

### Explicație

Funcția `isAvailable` verifică dacă o resursă este liberă într-un anumit interval de timp.

Condiția folosită este următoarea:

O resursă este disponibilă dacă fiecare rezervare existentă respectă una dintre situațiile:

1. rezervarea aparține altei resurse;
2. rezervarea existentă se termină înainte de începerea noului interval;
3. rezervarea existentă începe după terminarea noului interval.

Dacă există suprapunere între două intervale pentru aceeași resursă, rezervarea nu este permisă.

---

## 12. Crearea unei rezervări

```ts
export const createReservation =
  (
    userId: ID,
    resourceId: ID,
    slot: TimeSlot
  ): StateFn<SystemState, Validation<Reservation>> =>
  state => {
    const userV = ensureUserExists(userId)(state);

    if (isFailure(userV)) {
      return [userV, state];
    }

    const resV = ensureResourceExists(resourceId)(state);

    if (isFailure(resV)) {
      return [resV, state];
    }

    if (!isAvailable(slot, resourceId)(state)) {
      return [Validation.fail("Resource not available"), state];
    }

    const reservation: Reservation = {
      id: crypto.randomUUID(),
      user: userId,
      resource: resourceId,
      slot,
      createdAt: new Date()
    };

    const newState: SystemState = {
      ...state,
      reservations: new Map(state.reservations).set(
        reservation.id,
        reservation
      )
    };

    return [Validation.ok(reservation), newState];
  };
```

### Explicație pas cu pas

Funcția `createReservation` primește:

- ID-ul utilizatorului;
- ID-ul resursei;
- intervalul de timp dorit.

Apoi execută următorii pași:

1. verifică dacă utilizatorul există;
2. verifică dacă resursa există;
3. verifică dacă resursa este disponibilă;
4. creează obiectul `Reservation`;
5. creează o stare nouă a sistemului;
6. returnează rezervarea creată și noua stare.

Un aspect important este că starea inițială nu este modificată direct. În schimb, se creează o nouă stare folosind:

```ts
new Map(state.reservations).set(reservation.id, reservation)
```

Această abordare este apropiată de stilul funcțional, deoarece evită modificarea directă a datelor existente.

---

## 13. Nivelul de persistență

Pentru persistență se folosește MongoDB.

```ts
import { MongoClient } from "mongodb";
import { User, Resource, Reservation, SystemState } from "./domain";

export const mongo = new MongoClient("mongodb://localhost:27017");
export const db = mongo.db("reservation_system");

export async function loadStateFromMongo(): Promise<SystemState> {
  const users = await db.collection<User>("users").find().toArray();
  const resources = await db.collection<Resource>("resources").find().toArray();
  const reservations = await db
    .collection<Reservation>("reservations")
    .find()
    .toArray();

  return {
    users: new Map(users.map(u => [u.id, u])),
    resources: new Map(resources.map(r => [r.id, r])),
    reservations: new Map(reservations.map(r => [r.id, r]))
  };
}

export async function saveStateToMongo(state: SystemState) {
  await db.collection("users").deleteMany({});
  await db.collection("resources").deleteMany({});
  await db.collection("reservations").deleteMany({});

  await db.collection("users").insertMany([...state.users.values()]);
  await db.collection("resources").insertMany([...state.resources.values()]);
  await db.collection("reservations").insertMany([
    ...state.reservations.values()
  ]);
}
```

### Explicație

Funcția `loadStateFromMongo` citește datele din colecțiile MongoDB:

- `users`;
- `resources`;
- `reservations`.

Apoi transformă aceste date în obiecte `Map`, pentru a recrea starea aplicației.

Funcția `saveStateToMongo` salvează starea curentă în MongoDB.

Înainte de salvare, colecțiile sunt golite cu `deleteMany({})`, apoi sunt inserate valorile existente în starea aplicației.

---

## 14. Fișierul `main.ts`

Fișierul `main.ts` reprezintă punctul de intrare al aplicației.

```ts
import { createReservation } from "./domain/logic";
import { TimeSlot } from "./domain/types";
import {
  mongo,
  db,
  loadStateFromMongo,
  saveStateToMongo
} from "./persistence";

async function main() {
  await mongo.connect();

  const existingUsers = await db.collection("users").countDocuments();

  if (existingUsers === 0) {
    await db.collection("users").insertOne({
      id: "u1",
      name: "Alice"
    });

    await db.collection("resources").insertOne({
      id: "r1",
      name: "Conference Room A"
    });
  }

  const state = await loadStateFromMongo();

  const slot: TimeSlot = {
    start: new Date("2026-04-21T10:00:00"),
    end: new Date("2026-04-21T11:00:00")
  };

  console.log("Attempting reservation...");

  const [result, newState] = createReservation("u1", "r1", slot)(state);

  if (result.ok) {
    console.log("Reservation created:", result.value);
  } else {
    console.log("Failed:", result.errors);
  }

  await saveStateToMongo(newState);

  console.log("\nState after operation:");
  console.log([...newState.reservations.values()]);

  await mongo.close();
}

main();
```

### Explicație

Aplicația realizează următoarele acțiuni:

1. se conectează la MongoDB;
2. verifică dacă există utilizatori în baza de date;
3. dacă nu există, inserează un utilizator și o resursă implicită;
4. încarcă starea sistemului din MongoDB;
5. definește un interval de timp pentru rezervare;
6. încearcă să creeze o rezervare;
7. afișează rezultatul;
8. salvează noua stare în MongoDB;
9. închide conexiunea la baza de date.

---

## 15. Structura recomandată a proiectului

O structură clară pentru proiect poate fi următoarea:

```txt
reservation-system/
│
├── src/
│   ├── domain/
│   │   ├── types.ts
│   │   ├── functors.ts
│   │   └── logic.ts
│   │
│   ├── persistence/
│   │   └── index.ts
│   │
│   └── main.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 16. Instalare și rulare

### Cerințe

Pentru rularea proiectului sunt necesare:

- Node.js;
- TypeScript;
- MongoDB instalat local;
- pachetul `mongodb`.

---

### Instalarea dependențelor

```bash
npm init -y
npm install mongodb
npm install -D typescript ts-node @types/node
```

---

### Inițializarea TypeScript

```bash
npx tsc --init
```

---

### Rularea aplicației

```bash
npx ts-node src/main.ts
```

---

## 17. Exemplu de rezultat în consolă

La prima rulare, aplicația va crea automat un utilizator și o resursă.

Un posibil rezultat este:

```txt
Attempting reservation...
Reservation created: {
  id: "generated-uuid",
  user: "u1",
  resource: "r1",
  slot: {
    start: 2026-04-21T10:00:00.000Z,
    end: 2026-04-21T11:00:00.000Z
  },
  createdAt: 2026-04-21T09:30:00.000Z
}

State after operation:
[
  {
    id: "generated-uuid",
    user: "u1",
    resource: "r1",
    slot: {
      start: 2026-04-21T10:00:00.000Z,
      end: 2026-04-21T11:00:00.000Z
    },
    createdAt: 2026-04-21T09:30:00.000Z
  }
]
```

Dacă se încearcă o rezervare pe același interval pentru aceeași resursă, rezultatul va fi:

```txt
Attempting reservation...
Failed: [ "Resource not available" ]
```

---

## 18. Scenarii de validare

### Scenariul 1: Utilizator valid și resursă disponibilă

Date de intrare:

```ts
createReservation("u1", "r1", slot)
```

Rezultat:

```ts
Validation.ok(reservation)
```

---

### Scenariul 2: Utilizator inexistent

Date de intrare:

```ts
createReservation("u999", "r1", slot)
```

Rezultat:

```ts
Validation.fail("User not found")
```

---

### Scenariul 3: Resursă inexistentă

Date de intrare:

```ts
createReservation("u1", "r999", slot)
```

Rezultat:

```ts
Validation.fail("Resource not found")
```

---

### Scenariul 4: Resursă deja rezervată

Date de intrare:

```ts
createReservation("u1", "r1", slot)
```

Dacă există deja o rezervare pentru aceeași resursă și același interval, rezultatul este:

```ts
Validation.fail("Resource not available")
```

---

## 19. Observații despre abordarea funcțională

Proiectul folosește mai multe idei inspirate din programarea funcțională.

### 19.1 Funcții pure

Funcțiile precum `lookup`, `require`, `ensureUserExists`, `ensureResourceExists` și `isAvailable` sunt funcții predictibile, care produc același rezultat pentru aceleași date de intrare.

### 19.2 Imutabilitate

În loc să se modifice direct lista de rezervări, se creează o hartă nouă:

```ts
new Map(state.reservations).set(reservation.id, reservation)
```

Aceasta ajută la păstrarea unui comportament mai sigur și mai ușor de testat.

### 19.3 Tratarea explicită a erorilor

În loc să se arunce excepții, aplicația folosește tipul `Validation`.

Astfel, erorile sunt tratate explicit și pot fi afișate sau prelucrate mai ușor.

### 19.4 Separarea responsabilităților

Codul este împărțit în mai multe niveluri:

| Nivel | Responsabilitate |
|---|---|
| Domeniu | Definește tipurile și regulile aplicației. |
| Validare | Gestionează rezultatele valide sau erorile. |
| Logică | Creează rezervări și verifică disponibilitatea. |
| Persistență | Încarcă și salvează datele în MongoDB. |
| Main | Rulează aplicația și conectează modulele între ele. |

---

## 20. Puncte forte ale soluției

Soluția are mai multe avantaje:

- cod clar și modular;
- validări explicite;
- separarea logicii de business de persistență;
- folosirea TypeScript pentru siguranță la nivel de tipuri;
- folosirea MongoDB pentru salvarea datelor;
- posibilitatea de extindere cu noi funcționalități.

---

## 21. Posibile îmbunătățiri

Aplicația poate fi extinsă prin:

- adăugarea unei interfețe web;
- adăugarea autentificării utilizatorilor;
- implementarea ștergerii rezervărilor;
- implementarea modificării rezervărilor;
- adăugarea testelor unitare;
- validarea suplimentară a intervalului de timp;
- prevenirea rezervărilor cu dată de început mai mare decât data de final;
- folosirea unui repository separat pentru persistență;
- salvarea incrementală, fără ștergerea tuturor colecțiilor la fiecare operație.

---

## 22. Concluzie

Acest studiu de caz demonstrează cum poate fi construit un sistem simplu de rezervări folosind TypeScript, MongoDB și principii funcționale.

Aplicația este organizată în mod clar, separând modelul de date, validarea, logica de business și persistența. Folosirea tipurilor `Maybe` și `Validation` ajută la tratarea controlată a valorilor lipsă și a erorilor, iar `StateFn` permite modelarea operațiilor care transformă starea sistemului.

Prin această abordare, codul devine mai ușor de citit, testat, întreținut și extins.
