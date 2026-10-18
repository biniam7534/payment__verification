# BunaPay Backend

Node.js and Express API for BunaPay. PostgreSQL stores accounts, business profiles, and authentication tokens.

The backend runtime and tooling are Node.js, Express, and npm.

```text
backend/
  db/schema.sql
  src/
    accounts.js
    app.js
    server.js
    validation.js
  test/
  package.json
```

## Setup

```bash
cd backend
cp .env.example .env
npm install
docker compose up -d db
npm run dev
```

The API creates its tables on startup. It listens on port `3000` by default. Set `DATABASE_URL` and `CORS_ALLOWED_ORIGINS` in `.env` for your environment.

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
