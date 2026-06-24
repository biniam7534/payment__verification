# Blue X V1 Role Document

## API Integration

This document explains the API integration responsibility for Version 1 of the Blue X payment verification app.

API integration means making sure the mobile frontend and Django backend work together correctly. This role checks that both sides use the same endpoints, request bodies, response bodies, authentication method, and error format.

---

## Main Goal

Connect the mobile app and backend so the full user flow works:

```text
Mobile login
-> Store token
-> Load profile
-> Submit verification request
-> Receive verification result
-> Load dashboard summary
-> Load transaction history
```

I may handle this part myself after the mobile and backend pieces are ready, but the contract must be clear from the beginning so both sides build the same flow.

---

## API Contract Rules

Every API should have:

- Clear endpoint path
- HTTP method
- Required request fields
- Optional request fields
- Success response
- Error response
- Authentication requirement

The backend and mobile team should not guess these details separately. They must agree on one contract.

---

## Authentication Contract

Register:

```text
POST /api/accounts/register/
```

Login:

```text
POST /api/accounts/login/
```

Protected APIs must receive token from the mobile app.

Example header:

```text
Authorization: Token <token>
```

or, if JWT is used:

```text
Authorization: Bearer <token>
```

The team must choose one token style and use it everywhere.

---

## Main Endpoints

Accounts:

```text
POST /api/accounts/register/
POST /api/accounts/login/
POST /api/accounts/logout/
GET /api/accounts/profile/
PUT /api/accounts/profile/
```

Verification:

```text
POST /api/verification/verify/
GET /api/verification/transactions/
GET /api/verification/dashboard/summary/?period=week
GET /api/verification/dashboard/summary/?period=month
GET /api/verification/dashboard/summary/?period=year
```

---

## Standard Success Response

All APIs should return a predictable success format.

Example:

```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {}
}
```

Some endpoints can include direct fields like `status` or `transaction`, but the format should still be consistent enough for mobile developers to handle easily.

---

## Standard Error Response

All APIs should return a predictable error format.

Example:

```json
{
  "success": false,
  "message": "Receipt reference is required",
  "errors": {
    "receipt_id": ["This field is required."]
  }
}
```

Mobile app should use:

- `message` for user-facing error text
- `errors` for field-specific validation errors

---

## Verification Request Contract

Endpoint:

```text
POST /api/verification/verify/
```

Request:

```json
{
  "provider": "cbe",
  "bank_name": "CBE",
  "receipt_id": "FT23001234ABC",
  "transaction_reference": "FT23001234ABC",
  "receipt_url": "",
  "sender_name": "Customer Name",
  "sender_phone": "0911223344",
  "amount": "500.00",
  "receiver_name": "Natnael Example",
  "receiver_account": "1000017692643"
}
```

Response:

```json
{
  "success": true,
  "status": "verified",
  "message": "Payment verified successfully",
  "transaction": {
    "id": 101,
    "provider": "cbe",
    "bank_name": "CBE",
    "receipt_id": "FT23001234ABC",
    "sender_name": "Customer Name",
    "sender_phone": "0911223344",
    "amount": "500.00",
    "currency": "ETB",
    "verified_at": "2026-06-24T14:20:00Z"
  }
}
```

Allowed status values:

- `verified`
- `pending`
- `failed`
- `unknown`

---

## Dashboard Contract

Endpoint:

```text
GET /api/verification/dashboard/summary/?period=month
```

Response:

```json
{
  "success": true,
  "period": "month",
  "total_verified_amount": "12500.00",
  "currency": "ETB",
  "total_scans": 80,
  "verified_count": 64,
  "pending_count": 5,
  "failed_count": 6,
  "unknown_count": 5,
  "by_provider": [
    {
      "provider": "CBE",
      "amount": "7000.00",
      "count": 30
    }
  ],
  "recent_transactions": []
}
```

The mobile dashboard should not calculate critical totals from random local data. It should display the backend summary.

---

## Integration Checklist

This role is complete when:

- Mobile app can register user through backend.
- Mobile app can login and store token.
- Token is sent with protected requests.
- Profile page loads backend profile data.
- Profile update saves through backend.
- Scanner page sends verification request.
- Backend response displays correctly in result card.
- Dashboard loads summary from backend.
- Dashboard loads transaction history from backend.
- Standard error responses display correctly in mobile app.
- Logged-out requests are rejected by backend and handled by mobile app.

