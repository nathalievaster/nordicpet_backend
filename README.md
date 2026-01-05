# NordicPet API
Detta projekt är en REST-baserad backend för en intern lagerhanteringsapplikation för det fiktiva företaget NordicPet, en djuraffär som säljer produkter såsom djurfoder, koppel, leksaker och andra tillbehör.

API:t används av både lagerpersonal och kontorspersonal för att hantera produkter, kategorier, lagersaldo och användare med olika behörighetsnivåer.

## Tekniker

- Node.js
- Hapi.js – backend-ramverk
- Prisma ORM
- SQLite
- JWT (JSON Web Tokens) – autentisering
- bcrypt – lösenordshashning
- Joi – validering av inkommande data

## Autentisering & Roller

Applikationen använder JWT-baserad autentisering.

### Roller

admin – full behörighet

user – grundläggande åtkomst 

Vid registrering sätts rollen automatiskt till user.
Roller ändras endast via admin-endpoints eller seed-script av säkerhetsskäl.

## Installation & start
npm install

Miljövariabler (.env)
DATABASE_URL="file:./dev.db"
JWT_SECRET="supersecretkey"

ADMIN_EMAIL=adminstrator@nordicpet.se
ADMIN_PASSWORD=
ADMIN_NAME=Admin

Kör migrationer
npx prisma migrate dev

Seeda admin-användare
npm run seed

Starta servern
npm run dev


Servern körs på:

http://localhost:3000

## Datamodeller

User
* id
* name
* email (unik)
* password (hashad)
* role

Category
* id
* name
* description
* Product
* id
* name
* description
* price
* imageUrl
* categoryId

Inventory
* id
* productId
* quantity

## Auth-endpoints

**Registrera användare**

POST /auth/register 

{
  "name": "Anna",
  "email": "anna@test.se",
  "password": "password123"
}

**Logga in**

POST /auth/login

{
  "email": "anna@test.se",
  "password": "password123"
}

Svar:

{
  "token": "JWT_TOKEN"
}

User (Admin)
**Ändra användarroll**

PATCH /users/{id}/role
Kräver admin

{
  "role": "user"
}

## Category CRUD

**Skapa kategori**

POST /categories

{
  "name": "Tillbehör",
  "description": "Koppel, skålar, leksaker"
}

**Hämta alla kategorier**

GET /categories

## Product CRUD

**Hämta alla produkter**

GET /products

**Hämta produkt via ID**

GET /products/{id}

**Skapa produkt**

POST /products
Kräver admin

{
  "name": "Koppel",
  "description": "Koppel till hundar",
  "price": 79,
  "imageUrl": "bild",
  "categoryId": 1,
  "quantity": 5
}

**Uppdatera produkt**

PUT /products/{id}
Kräver admin

**Ta bort produkt**

DELETE /products/{id}
Kräver admin

## Lagerhantering
**Justera lagersaldo**

PATCH /inventory/{productId}

{
  "change": 5
}


eller minska:

{
  "change": -2
}


Detta uppfyller kravet på enkel ökning/minskning av lagersaldo.

## Validering & Felhantering

Alla POST/PUT-endpoints använder Joi

Tydliga felmeddelanden returneras vid:

Ogiltig input

Saknade fält

Otillåtna roller

Prisma hanterar relations- och databasfel

## Arkitektur & säkerhet

Roller sätts aldrig via öppna endpoints

Admin skapas via seed-script

Lösenord lagras aldrig i klartext

JWT krävs för skyddade routes

Tydlig separation mellan:

routes

controllers

validators

utils

### Videopresentation

Infogar länk här senare...

## Skapare

Nathalie Fredriksson
Webbutveckling