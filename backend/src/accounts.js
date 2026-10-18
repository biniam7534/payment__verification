import { Router } from "express";
import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { RequestValidationError, validateLogin, validateProfileUpdate, validateRegistration } from "./validation.js";

const SCAN_USAGE_FREE_LIMIT = Number.parseInt(process.env.SCAN_USAGE_FREE_LIMIT ?? "20", 10);
const USER_COLUMNS = "id, full_name, phone_number, email";
const PROFILE_FIELDS = [
  "business_name",
  "business_type",
  "receiver_name",
  "receiver_account",
  "default_provider",
];

export function createAccountsRouter(pool) {
  const router = Router();

  router.post("/register", async (req, res, next) => {
    try {
      const data = validateRegistration(req.body);
      const passwordHash = await bcrypt.hash(data.password, 12);
      const token = createToken();
      const client = await pool.connect();

      try {
        await client.query("BEGIN");
        const { rows } = await client.query(
          `INSERT INTO bunapay_users (full_name, phone_number, email, password_hash)
           VALUES ($1, $2, $3, $4)
           RETURNING ${USER_COLUMNS}`,
          [data.full_name, data.phone_number, data.email, passwordHash],
        );
        const user = rows[0];
        await client.query("INSERT INTO bunapay_business_profiles (user_id) VALUES ($1)", [user.id]);
        await saveToken(client, user.id, token);
        await client.query("COMMIT");

        return res.status(201).json({
          success: true,
          message: "Registration successful.",
          token,
          user: serializeUser(user),
        });
      } catch (error) {
        await client.query("ROLLBACK");
        if (error.code === "23505") {
          throw new RequestValidationError({
            phone_number: ["A user with this phone number already exists."],
          });
        }
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      next(error);
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      const data = validateLogin(req.body);
      const { rows } = await pool.query(
        `SELECT ${USER_COLUMNS}, password_hash, is_active
         FROM bunapay_users WHERE phone_number = $1`,
        [data.phone_number],
      );
      const user = rows[0];
      if (!user || !(await bcrypt.compare(data.password, user.password_hash))) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone number or password.",
        });
      }
      if (!user.is_active) {
        return res.status(400).json({ success: false, message: "This account is inactive." });
      }

      const token = createToken();
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query("DELETE FROM bunapay_auth_tokens WHERE user_id = $1", [user.id]);
        await saveToken(client, user.id, token);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }

      return res.json({ success: true, message: "Login successful.", token, user: serializeUser(user) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/logout", requireAuthentication(pool), async (req, res, next) => {
    try {
      await pool.query("DELETE FROM bunapay_auth_tokens WHERE id = $1", [req.auth.tokenId]);
      return res.json({ success: true, message: "Logout successful." });
    } catch (error) {
      next(error);
    }
  });

  router.get("/profile", requireAuthentication(pool), async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        `SELECT u.${USER_COLUMNS.split(", ").join(", u.")},
                p.business_name, p.business_type, p.receiver_name,
                p.receiver_account, p.default_provider
         FROM bunapay_users u
         LEFT JOIN bunapay_business_profiles p ON p.user_id = u.id
         WHERE u.id = $1`,
        [req.auth.userId],
      );
      const row = rows[0];
      if (!row) return res.status(401).json({ success: false, message: "Authentication credentials were not provided." });

      return res.json({
        success: true,
        user: serializeUser(row),
        business_profile: serializeBusinessProfile(row),
        scan_usage: { used: 0, limit: SCAN_USAGE_FREE_LIMIT },
      });
    } catch (error) {
      next(error);
    }
  });

  router.put("/profile", requireAuthentication(pool), async (req, res, next) => {
    try {
      const updates = validateProfileUpdate(req.body);
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const userUpdates = Object.fromEntries(
          Object.entries(updates).filter(([field]) => field === "full_name" || field === "email"),
        );
        const profileUpdates = Object.fromEntries(
          Object.entries(updates).filter(([field]) => PROFILE_FIELDS.includes(field)),
        );
        await updateFields(client, "bunapay_users", userUpdates, req.auth.userId);
        await client.query(
          "INSERT INTO bunapay_business_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING",
          [req.auth.userId],
        );
        await updateFields(client, "bunapay_business_profiles", profileUpdates, req.auth.userId, "user_id");
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }

      const { rows } = await pool.query(
        `SELECT u.${USER_COLUMNS.split(", ").join(", u.")},
                p.business_name, p.business_type, p.receiver_name,
                p.receiver_account, p.default_provider
         FROM bunapay_users u
         LEFT JOIN bunapay_business_profiles p ON p.user_id = u.id
         WHERE u.id = $1`,
        [req.auth.userId],
      );
      const row = rows[0];
      return res.json({
        success: true,
        message: "Profile updated successfully.",
        user: serializeUser(row),
        business_profile: serializeBusinessProfile(row),
        scan_usage: { used: 0, limit: SCAN_USAGE_FREE_LIMIT },
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

function requireAuthentication(pool) {
  return async (req, res, next) => {
    const authorization = req.get("Authorization") ?? "";
    const match = authorization.match(/^Token ([^\s]+)$/);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Authentication credentials were not provided.",
      });
    }

    try {
      const tokenHash = hashToken(match[1]);
      const { rows } = await pool.query(
        `SELECT t.id AS token_id, u.id AS user_id
         FROM bunapay_auth_tokens t
         JOIN bunapay_users u ON u.id = t.user_id
         WHERE t.token_hash = $1 AND u.is_active = TRUE`,
        [tokenHash],
      );
      if (!rows[0]) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token.",
        });
      }
      req.auth = { tokenId: rows[0].token_id, userId: rows[0].user_id };
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

async function saveToken(client, userId, token) {
  await client.query(
    "INSERT INTO bunapay_auth_tokens (user_id, token_hash) VALUES ($1, $2)",
    [userId, hashToken(token)],
  );
}

function createToken() {
  return randomBytes(32).toString("hex");
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

async function updateFields(client, table, updates, userId, idField = "id") {
  const entries = Object.entries(updates);
  if (!entries.length) return;
  const assignments = entries.map(([field], index) => `${field} = $${index + 1}`);
  const values = entries.map(([, value]) => value);
  values.push(userId);
  await client.query(
    `UPDATE ${table} SET ${assignments.join(", ")}, updated_at = NOW()
     WHERE ${idField} = $${values.length}`,
    values,
  );
}

function serializeUser(user) {
  return {
    id: Number(user.id),
    full_name: user.full_name,
    phone_number: user.phone_number,
    email: user.email,
  };
}

function serializeBusinessProfile(profile = {}) {
  return Object.fromEntries(PROFILE_FIELDS.map((field) => [field, profile[field] ?? ""]));
}
