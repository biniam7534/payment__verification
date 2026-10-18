export const ETHIOPIAN_PHONE_ERROR =
  "Enter a valid Ethiopian phone number (e.g. 0911000000 or +251911000000).";

export class RequestValidationError extends Error {
  constructor(errors) {
    super(firstError(errors));
    this.name = "RequestValidationError";
    this.status = 400;
    this.errors = errors;
  }
}

export function normalizeEthiopianPhone(value) {
  return value.startsWith("+251") ? `0${value.slice(4)}` : value;
}

export function validateEthiopianPhone(value) {
  if (!/^(?:\+251|0)9\d{8}$/.test(value)) {
    throw new RequestValidationError({ phone_number: [ETHIOPIAN_PHONE_ERROR] });
  }
  return normalizeEthiopianPhone(value);
}

export function validateRegistration(body = {}) {
  assertRequestBody(body);
  const errors = {};
  const fullName = readString(body.full_name, "full_name", errors, { required: true, max: 255 });
  const rawPhone = readString(body.phone_number, "phone_number", errors, { required: true });
  const email = readString(body.email === undefined ? "" : body.email, "email", errors, {
    max: 254,
    allowBlank: true,
  });
  const password = readString(body.password, "password", errors, { required: true });
  let phoneNumber;

  if (password && password.length < 8) {
    errors.password = ["Ensure this field has at least 8 characters."];
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ["Enter a valid email address."];
  }
  if (rawPhone) {
    try {
      phoneNumber = validateEthiopianPhone(rawPhone);
    } catch (error) {
      errors.phone_number = error.errors.phone_number;
    }
  }
  if (Object.keys(errors).length) throw new RequestValidationError(errors);

  return { full_name: fullName, phone_number: phoneNumber, email, password };
}

export function validateLogin(body = {}) {
  assertRequestBody(body);
  const errors = {};
  const rawPhone = readString(body.phone_number, "phone_number", errors, { required: true });
  const password = readString(body.password, "password", errors, { required: true });
  let phoneNumber;

  if (rawPhone) {
    try {
      phoneNumber = validateEthiopianPhone(rawPhone);
    } catch (error) {
      errors.phone_number = error.errors.phone_number;
    }
  }
  if (Object.keys(errors).length) throw new RequestValidationError(errors);

  return { phone_number: phoneNumber, password };
}

export function validateProfileUpdate(body = {}) {
  assertRequestBody(body);
  const userFields = ["full_name", "email"];
  const profileFields = {
    business_name: 255,
    business_type: 100,
    receiver_name: 255,
    receiver_account: 100,
    default_provider: 50,
  };
  const allowedFields = new Set([...userFields, ...Object.keys(profileFields)]);
  const errors = {};
  const updates = {};

  for (const field of Object.keys(body)) {
    if (!allowedFields.has(field)) {
      errors[field] = ["This field is not allowed."];
      continue;
    }
    const max = field === "email" ? 254 : profileFields[field] ?? 255;
    const value = readString(body[field], field, errors, {
      max,
      allowBlank: field !== "full_name",
    });
    if (value !== undefined) updates[field] = value;
    if (field === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.email = ["Enter a valid email address."];
    }
  }

  if (Object.keys(errors).length) throw new RequestValidationError(errors);
  return updates;
}

function readString(value, field, errors, { required = false, max, allowBlank = false } = {}) {
  if (value === undefined) {
    if (required) errors[field] = ["This field is required."];
    return undefined;
  }
  if (value === null) {
    errors[field] = ["This field may not be null."];
    return undefined;
  }
  if (typeof value !== "string") {
    errors[field] = ["Not a valid string."];
    return undefined;
  }
  const result = value.trim();
  if (!result && !allowBlank) {
    errors[field] = ["This field may not be blank."];
  } else if (max && result.length > max) {
    errors[field] = [`Ensure this field has no more than ${max} characters.`];
  }
  return result;
}

function assertRequestBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new RequestValidationError({
      non_field_errors: ["Expected an object containing request data."],
    });
  }
}

function firstError(errors) {
  return Object.values(errors).flat()[0] ?? "Request failed.";
}
