import test from "node:test";
import assert from "node:assert/strict";
import {
  ETHIOPIAN_PHONE_ERROR,
  RequestValidationError,
  normalizeEthiopianPhone,
  validateEthiopianPhone,
  validateLogin,
  validateProfileUpdate,
  validateRegistration,
} from "../src/validation.js";

test("normalizes Ethiopian phone numbers to the local format", () => {
  assert.equal(validateEthiopianPhone("0911000000"), "0911000000");
  assert.equal(normalizeEthiopianPhone("+251911000000"), "0911000000");
  assert.equal(validateEthiopianPhone("+251911000000"), "0911000000");
});

test("rejects invalid Ethiopian phone numbers with the account API message", () => {
  assert.throws(
    () => validateEthiopianPhone("12345"),
    (error) => error instanceof RequestValidationError && error.message === ETHIOPIAN_PHONE_ERROR,
  );
});

test("rejects non-object request bodies and null profile fields", () => {
  assert.throws(
    () => validateRegistration(null),
    (error) => error.errors.non_field_errors[0] === "Expected an object containing request data.",
  );
  assert.throws(
    () => validateProfileUpdate({ business_name: null }),
    (error) => error.errors.business_name[0] === "This field may not be null.",
  );
});

test("registration requires valid account details and an eight-character password", () => {
  assert.deepEqual(
    validateRegistration({
      full_name: "  Natnael Example ",
      phone_number: "+251911000000",
      email: "natnael@example.com",
      password: "securepass123",
    }),
    {
      full_name: "Natnael Example",
      phone_number: "0911000000",
      email: "natnael@example.com",
      password: "securepass123",
    },
  );
  assert.throws(
    () => validateRegistration({ full_name: "Name", phone_number: "0911000000", password: "short" }),
    (error) => error.errors.password[0].includes("at least 8"),
  );
});

test("login normalizes the phone number and profile updates preserve partial fields", () => {
  assert.deepEqual(validateLogin({ phone_number: "+251911000000", password: "password" }), {
    phone_number: "0911000000",
    password: "password",
  });
  assert.deepEqual(
    validateProfileUpdate({ full_name: "Updated Name", email: "", default_provider: "" }),
    { full_name: "Updated Name", email: "", default_provider: "" },
  );
  assert.throws(
    () => validateProfileUpdate({ full_name: "" }),
    (error) => error.errors.full_name[0] === "This field may not be blank.",
  );
});
