# Blue X Payment Verification App

## V1 MVP Blueprint For The Team

This document explains the first version of the Blue X payment verification app. I want everyone to read this and understand the project flow before we start building separate parts.

The goal is to keep Version 1 simple, clear, and buildable. We are not building every finance feature in the first version. We are building the main payment verification loop first, then we will improve it step by step.

---

## Main Idea

Blue X is a mobile app for businesses that helps them verify customer payments.

The problem we are solving is simple: many businesses receive payment screenshots, receipt images, mobile transfer confirmations, or transaction references from customers. Some are real, some are fake, some are pending, and some are hard to confirm manually.

Our app should help a business user answer one important question:

> Did this customer really pay?

For Version 1, the app will have three main pages:

- Profile
- Scanner
- Dashboard

The frontend mobile app will collect and display information. The backend will handle account logic, verification logic, provider API calls, database saving, and dashboard data.

Important rule:

> The frontend does not decide whether a payment is real. The backend is the source of truth.

---

## Project Flow

This is the main flow we are building:

```text
User opens the mobile app
-> User creates an account or logs in
-> User sets basic business/profile information
-> User opens Scanner page
-> User scans or manually enters receipt/payment details
-> Mobile app sends the data to backend
-> Backend validates the request
-> Backend calls the payment verification provider
-> Backend receives provider response
-> Backend decides the final status
-> Backend saves the verification result in the database
-> Backend returns clean result data to the mobile app
-> Mobile app displays the result card
-> Dashboard reads saved data from backend
-> User sees payment history and financial summary
```

The status returned by the backend should be one of these:

- `verified`
- `pending`
- `failed`
- `unknown`

The dashboard should not depend on temporary frontend data. It must read saved backend data.

---

## Tech Stack

For the backend, we will use:

- Django
- Django REST Framework
- PostgreSQL

For the mobile app, we will choose one of these before development starts:

- React Native with Expo
- Flutter

The mobile team must agree on one framework before they start building so the app stays consistent.

External verification providers we researched:

- `qbirr`
- `v.odit.et`
- `verify.et`

We should not try to connect every provider at the same time. First we build the app flow with one confirmed provider or a mock provider. After the flow works, we can add more providers.

---

## Mobile Frontend Work

The mobile app is the frontend. It should focus on screens, user actions, loading states, API calls, and displaying backend responses.

The frontend should not store API keys for payment providers. It should not call qbirr, v.odit.et, verify.et, or any bank provider directly. It only calls our backend.

### Profile Page

The Profile page is for user and business information.

What the page should show:

- Logged-in user name
- Phone number
- Business name
- Receiver name
- Receiver account or receiver phone
- Default provider/bank if available
- Scan usage summary if available
- Logout button

What the page should allow:

- Create or update business profile
- Edit receiver name
- Edit receiver account/phone
- Save profile changes
- Logout

APIs this page should call:

```text
GET /api/accounts/profile/
PUT /api/accounts/profile/
POST /api/accounts/logout/
```

Profile update request example:

```json
{
  "business_name": "Blue Shop",
  "business_type": "Retail",
  "receiver_name": "Natnael Example",
  "receiver_account": "1000017692643",
  "default_provider": "cbe"
}
```

Profile response example:

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
    "used": 5,
    "limit": 20
  }
}
```

### Scanner Page

The Scanner page is the main page of the app.

What the page should do:

- Let the user choose provider/bank
- Let the user manually enter receipt ID or transaction reference
- Let the user enter amount if available
- Let the user enter sender name or sender phone if available
- Let the user scan QR code or receipt URL if scanner is ready
- Show loading while waiting for backend
- Show result card after backend responds
- Show clear error message if something fails

For the first build, manual entry should come first. QR scanning can come after manual entry works. OCR receipt photo scanning can come later because it is more difficult and receipt formats are different.

API this page should call:

```text
POST /api/verification/verify/
```

Verification request example:

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

Verification response example:

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

The result card should clearly show:

- Status
- Amount
- Bank/provider
- Sender name if available
- Receipt/reference ID
- Date/time
- Message from backend

### Dashboard Page

The Dashboard page is also part of the mobile frontend. It shows saved payment history and financial analysis from the backend.

What the page should show:

- Total verified amount
- Total scans
- Verified count
- Pending count
- Failed count
- Unknown count
- Recent transactions
- Breakdown by provider/bank
- Weekly summary
- Monthly summary
- Yearly summary
- Search/filter history if possible

APIs this page should call:

```text
GET /api/verification/dashboard/summary/?period=week
GET /api/verification/dashboard/summary/?period=month
GET /api/verification/dashboard/summary/?period=year
GET /api/verification/transactions/
```

Dashboard summary response example:

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
    },
    {
      "provider": "Telebirr",
      "amount": "5500.00",
      "count": 34
    }
  ],
  "recent_transactions": [
    {
      "id": 101,
      "status": "verified",
      "provider": "CBE",
      "sender_name": "Customer Name",
      "amount": "500.00",
      "created_at": "2026-06-24T14:20:00Z"
    }
  ]
}
```

The dashboard should be easy for non-technical shop owners. It should not be crowded.

---

## Backend Work

The backend is responsible for business logic, verification, saving data, dashboard data, authentication, validation, and security.

The backend should be built with Django and Django REST Framework.

Backend structure for V1:

```text
backend/
  accounts/
    models.py
    serializers.py
    views.py
    urls.py
    permissions.py

  verification/
    models.py
    serializers.py
    views.py
    urls.py
    services.py
    providers/
      base.py
      qbirr.py
      odit.py
      verify_et.py

  analytics/
    services.py
    serializers.py
    views.py
    urls.py
```

The team can add more files if needed, but the structure should stay small and understandable.

### Accounts App

The `accounts` app handles users and business profile.

Models it should include:

- User or custom user model
- BusinessProfile

Main fields for User:

- `id`
- `full_name`
- `phone_number`
- `email`
- `password`
- `is_active`
- `created_at`
- `updated_at`

Main fields for BusinessProfile:

- `id`
- `user`
- `business_name`
- `business_type`
- `receiver_name`
- `receiver_account`
- `default_provider`
- `created_at`
- `updated_at`

Serializers it should include:

- RegisterSerializer
- LoginSerializer
- UserSerializer
- BusinessProfileSerializer
- ProfileSerializer

Views or functions it should include:

- RegisterView
- LoginView
- LogoutView
- ProfileView

Rules:

- Users cannot access Scanner or Dashboard without login.
- V1 can skip phone number verification.
- The backend should still validate phone number format.
- Passwords must be hashed. Never save plain text passwords.
- User should only access their own profile.

### Verification App

The `verification` app handles payment verification and transaction saving.

Models it should include:

- VerificationTransaction
- ScanUsage

Main fields for VerificationTransaction:

- `id`
- `user`
- `business_profile`
- `provider`
- `bank_name`
- `receipt_id`
- `transaction_reference`
- `receipt_url`
- `sender_name`
- `sender_phone`
- `receiver_name`
- `receiver_account`
- `amount`
- `currency`
- `status`
- `verified_at`
- `provider_transaction_date`
- `raw_provider_response`
- `failure_reason`
- `is_duplicate`
- `created_at`
- `updated_at`

Main fields for ScanUsage:

- `id`
- `user`
- `month`
- `scan_count`
- `free_limit`
- `created_at`
- `updated_at`

Serializers it should include:

- VerificationRequestSerializer
- VerificationTransactionSerializer
- DashboardSummarySerializer
- TransactionHistorySerializer

Views or functions it should include:

- VerifyPaymentView
- TransactionHistoryView
- DashboardSummaryView

Services it should include:

- Provider selection service
- Provider API call service
- Response normalization service
- Duplicate reference check
- Save verification transaction function
- Scan usage count function

Backend verification process:

```text
Receive request
-> Check authenticated user
-> Validate input
-> Check scan usage limit
-> Check duplicate receipt/reference
-> Select provider service
-> Call provider API
-> Normalize provider result
-> Save verification transaction
-> Increase scan usage
-> Return clean response to frontend
```

Important rule:

> Verification and saving happen in the backend. Frontend only receives the final clean response.

### Provider Services

Provider services should hide the differences between qbirr, v.odit.et, verify.et, and future providers.

Every provider service should return a normalized result like:

```json
{
  "status": "verified",
  "amount": "500.00",
  "currency": "ETB",
  "sender_name": "Customer Name",
  "receiver_name": "Natnael Example",
  "provider": "cbe",
  "transaction_date": "2026-06-24T14:20:00Z",
  "reference": "FT23001234ABC",
  "message": "Payment verified successfully",
  "raw_response": {}
}
```

This way, the mobile app does not need to know how each provider works.

### Analytics / Dashboard Backend

The dashboard backend reads saved verification transactions and returns meaningful summaries.

It should calculate:

- Total verified amount
- Scan count
- Status counts
- Recent transactions
- Amount grouped by provider
- Transactions grouped by time
- Weekly summary
- Monthly summary
- Yearly summary

Dashboard data must always be filtered by logged-in user.

---

## API Integration Work

The API integration work connects the mobile app and backend.

This work is not about creating a separate product. It is about making sure the frontend and backend agree on:

- Endpoint names
- Request body format
- Response body format
- Authentication token handling
- Error format
- Loading and retry behavior
- Required and optional fields

API integration should happen after the backend creates endpoints and the mobile app creates pages. But the contract must be agreed early so both sides build correctly.

Standard error response should look like this:

```json
{
  "success": false,
  "status": "unknown",
  "message": "Receipt reference is required",
  "errors": {
    "receipt_id": ["This field is required."]
  }
}
```

Authentication:

- Login/register should return a token.
- Mobile app should store token securely.
- Every protected API request should send the token.
- Backend should reject requests without valid token.

Protected APIs:

- Profile
- Verify payment
- Dashboard summary
- Transaction history

---

## QA And Testing Work

Every feature should have a clear pass/fail test.

The app should pass these tests before we call V1 complete:

Account tests:

- User can register.
- User can log in.
- Wrong password fails.
- Logged-out user cannot access scanner API.
- User can update business profile.

Scanner tests:

- User can submit manual receipt details.
- Backend returns one of the allowed statuses.
- Loading state appears while waiting.
- Result card displays backend response correctly.
- Missing receipt/reference shows a clear error.

Backend verification tests:

- Verification endpoint requires login.
- Request serializer validates required fields.
- Provider mock returns normalized result.
- Verification result is saved in database.
- Duplicate receipt/reference is detected.
- Scan usage count increases after verification.

Dashboard tests:

- Dashboard shows only logged-in user's transactions.
- Total verified amount is correct.
- Status counts are correct.
- Provider breakdown is correct.
- Recent transactions are ordered correctly.

Integration tests:

- Mobile login token works with backend.
- Mobile scanner request reaches backend.
- Backend saves result.
- Dashboard updates after verification.

Security tests:

- User A cannot see User B transactions.
- API keys are not exposed in mobile app.
- Raw provider response is not shown unnecessarily.
- Invalid token is rejected.

---

## V1 Boundaries

To finish the MVP, we must not build too many things at once.

These are not required in Version 1:

- Full admin panel
- Full payment subscription system
- Staff roles and permissions
- Multi-branch business management
- Advanced OCR for every receipt type
- Full accounting system
- Tax reports
- AI financial advice
- Bank reconciliation automation

These can come after the main verification loop works.

---

## V1 Is Complete When

Version 1 is complete when:

- A user can register and log in.
- A logged-in user can update business profile.
- A logged-in user can submit payment details from Scanner page.
- Backend verifies using real provider or mock provider.
- Backend saves the verification result.
- Frontend displays verified, pending, failed, or unknown clearly.
- Dashboard shows saved payment history.
- Dashboard shows total verified amount and provider breakdown.
- Users cannot access other users' data.
- Duplicate receipt/reference is handled.

The product promise for V1 is:

> Scan or enter a payment receipt, then know if the money is real.

