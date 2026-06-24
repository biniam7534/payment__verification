# Blue X V1 Role Document

## QA And Testing

This document explains the QA and testing responsibility for Version 1 of the Blue X payment verification app.

QA makes sure the app works as expected before we call the MVP complete. Testing should cover mobile screens, backend APIs, integration, security, and common failure cases.

---

## Main Goal

Create and run tests that prove the app works from login to verification to dashboard.

The main test flow is:

```text
Create account
-> Login
-> Update business profile
-> Submit verification request
-> Backend saves result
-> Mobile shows result card
-> Dashboard shows saved transaction
```

---

## Account Tests

These tests must pass:

- User can register.
- User can login.
- Wrong password fails.
- Missing phone number fails.
- Missing password fails.
- Logged-out user cannot access profile.
- Logged-in user can load profile.
- Logged-in user can update business profile.
- User cannot access another user's profile.

---

## Scanner Tests

These tests must pass:

- User can submit manual receipt details.
- Missing receipt/reference shows clear error.
- Missing provider/bank shows clear error.
- Backend returns one allowed status.
- Loading state appears while waiting.
- Result card displays status.
- Result card displays amount if backend returns amount.
- Result card displays provider/bank.
- Failed verification shows clear message.
- Unknown verification shows clear message.

Allowed statuses:

- `verified`
- `pending`
- `failed`
- `unknown`

---

## Backend Verification Tests

These tests must pass:

- Verification endpoint requires login.
- Verification request serializer validates required fields.
- Mock provider returns normalized result.
- Provider result is saved in database.
- Saved transaction belongs to logged-in user.
- Duplicate receipt/reference is detected.
- Scan usage count increases after verification.
- Scan limit is enforced if enabled.
- Raw provider response is saved in backend.
- Invalid provider returns clear error.

---

## Dashboard Tests

These tests must pass:

- Dashboard endpoint requires login.
- Dashboard shows only logged-in user's data.
- Total verified amount is correct.
- Verified count is correct.
- Pending count is correct.
- Failed count is correct.
- Unknown count is correct.
- Provider/bank breakdown is correct.
- Recent transactions are ordered newest first.
- Week/month/year filter returns correct period.

---

## API Integration Tests

These tests must pass:

- Mobile login receives token.
- Mobile sends token to protected APIs.
- Backend rejects missing token.
- Backend rejects invalid token.
- Mobile scanner request reaches backend.
- Backend response displays in mobile result card.
- Dashboard updates after a verification result is saved.
- Standard error response displays correctly in mobile app.

---

## Security Tests

These tests must pass:

- User A cannot see User B transactions.
- User A cannot update User B profile.
- Provider API keys are not inside the mobile app.
- Raw provider response is not shown to normal users unless intentionally allowed.
- Backend does not trust frontend status.
- Backend validates amount format.
- Backend validates phone/reference fields.

---

## Manual Test Script

Before demo, run this manual test:

1. Create a new account.
2. Login.
3. Add business profile details.
4. Open Scanner page.
5. Submit a manual verification request.
6. Confirm loading state appears.
7. Confirm result card appears.
8. Open Dashboard.
9. Confirm the transaction appears in recent history.
10. Confirm total amount and status count updated.
11. Logout.
12. Confirm protected pages are not accessible.

---

## Done When

This role is complete for V1 when:

- All account tests pass.
- All scanner tests pass.
- All backend verification tests pass.
- All dashboard tests pass.
- All integration tests pass.
- Main manual test script passes.
- Bugs are written clearly with steps to reproduce.
- No critical security issue is left unresolved.

