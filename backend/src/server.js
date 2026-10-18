import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { createApp } from "./app.js";

const { Pool } = pg;
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set before starting the API.");
}

const pool = new Pool({ connectionString: databaseUrl });
const schemaPath = fileURLToPath(new URL("../db/schema.sql", import.meta.url));
const schema = await readFile(schemaPath, "utf8");
await pool.query(schema);

const app = createApp(pool);
const server = app.listen(port, () => {
  console.log(`BunaPay API listening on port ${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(async (error) => {
      if (error) {
        console.error("Failed to close API server:", error);
        process.exitCode = 1;
      }
      await pool.end();
    });
  });
}
