import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createApp } from "../src/app.js";

test("account routes expose validation errors and protect profile access", async (t) => {
  const pool = {
    query: async () => {
      throw new Error("The database should not be queried for these requests.");
    },
  };
  const server = createApp(pool).listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  }));

  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { success: true });

  const profile = await fetch(`${baseUrl}/api/accounts/profile`);
  assert.equal(profile.status, 401);
  assert.equal((await profile.json()).success, false);

  const registration = await fetch(`${baseUrl}/api/accounts/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: "Natnael Example",
      phone_number: "12345",
      password: "securepass123",
    }),
  });
  const response = await registration.json();
  assert.equal(registration.status, 400);
  assert.equal(response.success, false);
  assert.match(response.message, /valid Ethiopian phone number/);
  assert.ok(response.errors.phone_number);
});
