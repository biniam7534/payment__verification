import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { once } from "node:events";
import { after, test } from "node:test";
import { createApp } from "../src/app.js";

const users = new Map();
let nextId = 1;
let databaseAvailable = true;

const pool = {
  async query(sql, values = []) {
    const statement = sql.replace(/\s+/g, " ").trim();
    if (statement === "SELECT 1") {
      if (!databaseAvailable) {
        throw new Error("Database unavailable");
      }
      return { rows: [{ "?column?": 1 }] };
    }

    if (statement.startsWith("INSERT INTO users")) {
      const [fullName, email, password] = values;
      if ([...users.values()].some((user) => user.email === email)) {
        throw Object.assign(new Error("Duplicate email"), { code: "23505" });
      }
      const user = { id: nextId++, full_name: fullName, email, password };
      users.set(user.id, user);
      return { rows: [publicUser(user)] };
    }

    if (statement.startsWith("SELECT id, full_name, email, created_at FROM users ORDER BY")) {
      return {
        rows: [...users.values()]
          .sort((left, right) => left.id - right.id)
          .map(publicUser),
      };
    }

    if (statement.startsWith("SELECT id, full_name, email, created_at FROM users WHERE")) {
      const user = users.get(values[0]);
      return { rows: user ? [publicUser(user)] : [] };
    }

    if (statement.startsWith("UPDATE users")) {
      const [id, fullName, email, password] = values;
      const user = users.get(id);
      if (!user) {
        return { rows: [] };
      }
      if (email && [...users.values()].some((other) => other.id !== id && other.email === email)) {
        throw Object.assign(new Error("Duplicate email"), { code: "23505" });
      }
      user.full_name = fullName ?? user.full_name;
      user.email = email ?? user.email;
      user.password = password ?? user.password;
      return { rows: [publicUser(user)] };
    }

    if (statement.startsWith("DELETE FROM users")) {
      const [id] = values;
      return { rows: users.delete(id) ? [{ id }] : [] };
    }

    throw new Error(`Unexpected SQL in test: ${statement}`);
  },
};

function publicUser(user) {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    created_at: new Date("2026-01-01T00:00:00.000Z"),
  };
}

const server = createApp(pool).listen(0);
await once(server, "listening");
const baseUrl = `http://127.0.0.1:${server.address().port}`;

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("health and user CRUD use database responses and never expose passwords", async () => {
  const health = await fetch(`${baseUrl}/api/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), {
    success: true,
    message: "Backend and PostgreSQL connected successfully",
  });

  const create = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      full_name: "Test User",
      email: "test@example.com",
      password: "securepass123",
    }),
  });
  assert.equal(create.status, 201);
  const created = await create.json();
  assert.equal(created.data.full_name, "Test User");
  assert.equal("password" in created.data, false);
  assert.equal("password_hash" in created.data, false);
  assert.equal(await bcrypt.compare("securepass123", users.get(created.data.id).password), true);

  const duplicate = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      full_name: "Another User",
      email: "test@example.com",
      password: "securepass123",
    }),
  });
  assert.equal(duplicate.status, 409);

  const list = await fetch(`${baseUrl}/api/users`);
  assert.equal(list.status, 200);
  assert.equal((await list.json()).data.length, 1);

  const userUrl = `${baseUrl}/api/users/${created.data.id}`;
  const get = await fetch(userUrl);
  assert.equal(get.status, 200);
  assert.equal((await get.json()).data.email, "test@example.com");

  const update = await fetch(userUrl, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ full_name: "Updated User" }),
  });
  assert.equal(update.status, 200);
  assert.equal((await update.json()).data.full_name, "Updated User");

  const remove = await fetch(userUrl, { method: "DELETE" });
  assert.equal(remove.status, 204);
  const missing = await fetch(userUrl);
  assert.equal(missing.status, 404);
});

test("health returns an error when the database query fails", async () => {
  databaseAvailable = false;
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    success: false,
    message: "Database connection failed",
  });
  databaseAvailable = true;
});
