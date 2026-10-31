import bcrypt from "bcryptjs";
import { HttpError } from "../middlewares/errorMiddleware.js";
import {
  createUser as insertUser,
  deleteUser as removeUser,
  getUserById as findUserById,
  getUsers as findUsers,
  updateUser as saveUser,
} from "../models/userModel.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BCRYPT_PASSWORD_BYTES = 72;

function validateId(value) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new HttpError(400, "User ID must be a positive integer.");
  }
  return id;
}

function validateText(value, field, maxLength) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${field} is required.`);
  }
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new HttpError(400, `${field} must be ${maxLength} characters or fewer.`);
  }
  return normalized;
}

function validateEmail(value) {
  const email = validateText(value, "Email", 254).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    throw new HttpError(400, "Enter a valid email address.");
  }
  return email;
}

function validatePassword(value) {
  if (typeof value !== "string" || value.length === 0) {
    throw new HttpError(400, "Password is required.");
  }
  if (Buffer.byteLength(value, "utf8") > MAX_BCRYPT_PASSWORD_BYTES) {
    throw new HttpError(400, "Password must be no more than 72 bytes.");
  }
  return value;
}

function validateUserBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Request body must be a JSON object.");
  }

  return {
    fullName: validateText(body.full_name, "Full name", 255),
    email: validateEmail(body.email),
    password: validatePassword(body.password),
  };
}

function validateUserUpdate(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Request body must be a JSON object.");
  }

  const values = {};
  if (Object.hasOwn(body, "full_name")) {
    values.fullName = validateText(body.full_name, "Full name", 255);
  }
  if (Object.hasOwn(body, "email")) {
    values.email = validateEmail(body.email);
  }
  if (Object.hasOwn(body, "password")) {
    values.password = validatePassword(body.password);
  }
  if (Object.keys(values).length === 0) {
    throw new HttpError(400, "Provide at least one field to update.");
  }
  return values;
}

export function createUserController(pool) {
  return {
    async create(req, res, next) {
      try {
        const { fullName, email, password } = validateUserBody(req.body);
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await insertUser(pool, { fullName, email, passwordHash });
        return res.status(201).json({ success: true, data: user });
      } catch (error) {
        return next(error);
      }
    },

    async list(_req, res, next) {
      try {
        const users = await findUsers(pool);
        return res.json({ success: true, data: users });
      } catch (error) {
        return next(error);
      }
    },

    async get(req, res, next) {
      try {
        const user = await findUserById(pool, validateId(req.params.id));
        if (!user) {
          throw new HttpError(404, "User not found.");
        }
        return res.json({ success: true, data: user });
      } catch (error) {
        return next(error);
      }
    },

    async update(req, res, next) {
      try {
        const id = validateId(req.params.id);
        const values = validateUserUpdate(req.body);
        const passwordHash = values.password
          ? await bcrypt.hash(values.password, 12)
          : undefined;
        const user = await saveUser(pool, id, {
          fullName: values.fullName,
          email: values.email,
          passwordHash,
        });
        if (!user) {
          throw new HttpError(404, "User not found.");
        }
        return res.json({ success: true, data: user });
      } catch (error) {
        return next(error);
      }
    },

    async delete(req, res, next) {
      try {
        const deleted = await removeUser(pool, validateId(req.params.id));
        if (!deleted) {
          throw new HttpError(404, "User not found.");
        }
        return res.status(204).end();
      } catch (error) {
        return next(error);
      }
    },
  };
}