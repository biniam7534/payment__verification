# BunaPay Backend

Django REST backend for the BunaPay (Blue X) payment verification app.

The backend owns:

- User accounts and authentication
- Business profile data
- Payment verification logic (next sprint)
- External provider API calls (next sprint)
- Verification result saving (next sprint)
- Dashboard summary data (next sprint)
- Transaction history (next sprint)
- Security and validation

The backend is the source of truth. The mobile app sends requests and displays responses, but the backend decides the final verification status.

## Folder Structure

```text
backend/
  manage.py
  config/
    settings/
      base.py
      development.py
      test.py
    urls.py
  apps/
    accounts/          # register, login, logout, profile
    verification/      # stub — payment verification (next sprint)
    analytics/         # stub — dashboard (next sprint)
  common/
  requirements/
  tests/
  scripts/
  docker-compose.yml
  .env.example
```

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements/development.txt
cp .env.example .env
docker compose up -d
python manage.py migrate
python manage.py runserver
```

Or use the dev script:

```bash
./scripts/run_dev.sh
```

### Without Docker

If Docker is not available, run tests with SQLite:

```bash
DJANGO_SETTINGS_MODULE=config.settings.test python manage.py test apps.accounts
```

For local development with PostgreSQL, start the database with `docker compose up -d` before running migrations.

## API Endpoints

All protected endpoints require:

```text
Authorization: Token <token>
```

### Register

```text
POST /api/accounts/register/
```

Request:

```json
{
  "full_name": "Natnael Example",
  "phone_number": "0911000000",
  "email": "natnael@example.com",
  "password": "securepass123"
}
```

Response:

```json
{
  "success": true,
  "message": "Registration successful.",
  "token": "<token>",
  "user": {
    "id": 1,
    "full_name": "Natnael Example",
    "phone_number": "0911000000",
    "email": "natnael@example.com"
  }
}
```

### Login

```text
POST /api/accounts/login/
```

Request:

```json
{
  "phone_number": "0911000000",
  "password": "securepass123"
}
```

### Logout

```text
POST /api/accounts/logout/
```

### Profile

```text
GET /api/accounts/profile/
PUT /api/accounts/profile/
```

GET response:

```json
{
  "success": true,
  "user": {
    "id": 1,
    "full_name": "Natnael Example",
    "phone_number": "0911000000"
  },
  "business_profile": {
    "business_name": "Blue Shop",
    "business_type": "Retail",
    "receiver_name": "Natnael Example",
    "receiver_account": "1000017692643",
    "default_provider": "cbe"
  },
  "scan_usage": {
    "used": 0,
    "limit": 20
  }
}
```

PUT request:

```json
{
  "full_name": "Natnael Example",
  "business_name": "Blue Shop",
  "business_type": "Retail",
  "receiver_name": "Natnael Example",
  "receiver_account": "1000017692643",
  "default_provider": "cbe"
}
```

### Error format

```json
{
  "success": false,
  "message": "Enter a valid Ethiopian phone number (e.g. 0911000000 or +251911000000).",
  "errors": {
    "phone_number": ["Enter a valid Ethiopian phone number (e.g. 0911000000 or +251911000000)."]
  }
}
```

## Tests

```bash
DJANGO_SETTINGS_MODULE=config.settings.test python manage.py test apps.accounts
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | Enable debug mode |
| `DATABASE_URL` | PostgreSQL connection URL |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts |
| `CORS_ALLOWED_ORIGINS` | Comma-separated CORS origins for mobile dev |

## Next Sprint

- `POST /api/verification/verify/` with mock provider
- `ScanUsage` model and limits
- Dashboard and transaction history APIs
- Real provider integrations (qbirr, v.odit.et, verify.et)
