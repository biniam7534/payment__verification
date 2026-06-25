# Blue X Backend

This folder is for the Django REST backend.

The backend owns:

- User accounts and authentication
- Business profile data
- Payment verification logic
- External provider API calls
- Verification result saving
- Dashboard summary data
- Transaction history
- Security and validation

The backend is the source of truth. The mobile app sends requests and displays responses, but the backend decides the final verification status.

## Folder Structure

```text
backend/
  config/
  apps/
    accounts/
    verification/
      providers/
    analytics/
  common/
  requirements/
  tests/
  scripts/
```

## App Responsibilities

`accounts` handles:

- Register
- Login
- Logout
- Profile
- Business profile

`verification` handles:

- Verification request validation
- Provider selection
- Provider API calls
- Response normalization
- Transaction saving
- Scan usage
- Duplicate receipt/reference handling

`verification/providers` handles:

- qbirr provider integration
- v.odit.et provider integration
- verify.et provider integration
- mock provider for development

`analytics` handles:

- Dashboard summary
- Transaction history
- Weekly/monthly/yearly summaries
- Provider/bank breakdown

Developers should generate the Django project and app files inside this structure when implementation starts.
