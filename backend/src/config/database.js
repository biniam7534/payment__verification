import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
let connectionConfig;

if (connectionString) {
  connectionConfig = { connectionString };
} else {
  const requiredVariables = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"];
  const missingVariables = requiredVariables.filter((name) => !process.env[name]);

  if (missingVariables.length > 0) {
    throw new Error(
      `Set DATABASE_URL or provide database environment variables: ${missingVariables.join(", ")}`,
    );
  }

  const port = Number.parseInt(process.env.DB_PORT ?? "5432", 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("DB_PORT must be a valid TCP port.");
  }

  connectionConfig = {
    host: process.env.DB_HOST,
    port,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };
}

const pool = new Pool({ ...connectionConfig, connectionTimeoutMillis: 5000 });

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

export default pool;
