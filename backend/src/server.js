import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";
import pool from "./config/database.js";

const port = Number.parseInt(process.env.PORT ?? "5000", 10);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port.");
}

const schemaPath = fileURLToPath(new URL("../db/schema.sql", import.meta.url));
let server;

try {
  const schema = await readFile(schemaPath, "utf8");
  await pool.query(schema);
  await pool.query("SELECT 1");

  const app = createApp(pool);
  server = app.listen(port, () => {
    console.log(`BunaPay API listening on port ${port}`);
  });
} catch (error) {
  console.error("Failed to initialize the PostgreSQL-backed API:", error);
  await pool.end();
  process.exitCode = 1;
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    if (!server) {
      return;
    }
    server.close(async (error) => {
      if (error) {
        console.error("Failed to close API server:", error);
        process.exitCode = 1;
      }
      await pool.end();
    });
  });
}
