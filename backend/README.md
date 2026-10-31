# BunaPay Backend

Node.js and Express API for BunaPay. PostgreSQL stores users, accounts, business
profiles, and authentication tokens.

The backend runtime and tooling are Node.js, Express, and npm.

```text
backend/
  db/schema.sql
  src/
    config/database.js
    app.js
    controllers/
    middlewares/
    models/
    routes/
    server.js
  test/
  package.json
```

## Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Create `backend/.env` from `.env.example` and set `DB_HOST`, `DB_PORT`,
`DB_NAME`, `DB_USER`, and `DB_PASSWORD`. The default configuration connects to
the local PostgreSQL database `payment` on port `5432`; the server creates
missing tables on startup and listens on port `5000`.

To start a matching PostgreSQL instance with Docker Compose, run
`docker compose up -d db` from `backend/` after creating `.env`. Compose uses
the same database name, user, password, and port configured for the API.

On Ubuntu, start PostgreSQL and check that it is accepting connections:

```bash
sudo systemctl enable --now postgresql
pg_isready -h localhost -p 5432
```

The configured database `payment` exists in the current development
environment. To create it if it is missing, run
`sudo -u postgres createdb payment`. The separately mentioned `student_db`
does not exist here and is not used by this backend; create it if needed with
`sudo -u postgres createdb student_db`.

If PostgreSQL requires password authentication, set the `postgres` role
password with `sudo -u postgres psql` followed by `\password postgres`, and put
the same password in the untracked local `.env`. Never commit `.env` or real
database credentials.

Run `npm start` for a normal start. `npm run dev` starts the server with
nodemon, and `npm test` runs the automated tests.

## PostgreSQL users API

The API creates `public.users` in `db/schema.sql`. It has `id`, `full_name`,
`email`, `password`, and `created_at` columns. Passwords are bcrypt-hashed
before storage and are never included in API responses.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Confirms PostgreSQL is reachable |
| `POST` | `/api/users` | Creates a user |
| `GET` | `/api/users` | Lists users |
| `GET` | `/api/users/:id` | Gets a user |
| `PUT` | `/api/users/:id` | Updates `full_name`, `email`, and/or `password` |
| `DELETE` | `/api/users/:id` | Deletes a user (returns `204 No Content`) |

Example request for `POST /api/users`:

```json
{
  "full_name": "Natnael Example",
  "email": "natnael@example.com",
  "password": "securepass123"
}
```

Responses are JSON with a `success` flag and, on success, user data. Duplicate
emails return `409 Conflict`, invalid requests return `400 Bad Request`, and
missing users return `404 Not Found`. The health endpoint returns
`503 Service Unavailable` if it cannot query PostgreSQL.

Example CRUD checks (use the ID returned by the create request):

```bash
curl -i http://localhost:5000/api/health
curl -i -X POST http://localhost:5000/api/users \
  -H 'Content-Type: application/json' \
  -d '{"full_name":"Natnael Example","email":"natnael@example.com","password":"securepass123"}'
curl -i http://localhost:5000/api/users
curl -i http://localhost:5000/api/users/1
curl -i -X PUT http://localhost:5000/api/users/1 \
  -H 'Content-Type: application/json' \
  -d '{"full_name":"Natnael Updated"}'
curl -i -X DELETE http://localhost:5000/api/users/1
```

Use pgAdmin 4 to connect to the `payment` database and inspect the
`public.users` table.

## Account API

All endpoints are under `/api/accounts`. Protected endpoints require:

```text
Authorization: Token <token>
```

### Register

`POST /api/accounts/register/`

```json
{
  "full_name": "Natnael Example",
  "phone_number": "0911000000",
  "email": "natnael@example.com",
  "password": "securepass123"
}
```

Creates the account and its empty business profile, then returns a token and public user data.

### Login and logout

- `POST /api/accounts/login/` with `phone_number` and `password` returns a token.
- `POST /api/accounts/logout/` revokes the authenticated token.

### Profile

- `GET /api/accounts/profile/` returns `user`, `business_profile`, and `scan_usage`.
- `PUT /api/accounts/profile/` partially updates `full_name`, `email`, and business profile fields.

Ethiopian phone numbers in `0911000000` or `+251911000000` format are accepted and stored in local format. Passwords are hashed; only a SHA-256 digest of each authentication token is stored.

### Responses

Successful and failed responses use a consistent JSON envelope. Validation failures include field errors:

```json
{
  "success": false,
  "message": "Enter a valid Ethiopian phone number (e.g. 0911000000 or +251911000000).",
  "errors": {
    "phone_number": [
      "Enter a valid Ethiopian phone number (e.g. 0911000000 or +251911000000)."
    ]
  }
}
```

## Tests

```bash
npm test
```
