import cors from "cors";
import express from "express";
import { createAccountsRouter } from "./accounts.js";
import { RequestValidationError } from "./validation.js";

export function createApp(pool) {
  const app = express();
  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : false }));
  app.use(express.json({ limit: "1mb" }));
  app.get("/health", (_req, res) => res.json({ success: true }));
  app.use("/api/accounts", createAccountsRouter(pool));

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Not found." });
  });

  app.use((error, _req, res, _next) => {
    if (error instanceof RequestValidationError) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }
    if (error instanceof SyntaxError && "body" in error) {
      return res.status(400).json({ success: false, message: "Malformed JSON request body." });
    }

    console.error("Unhandled API error:", error);
    return res.status(500).json({ success: false, message: "An unexpected error occurred." });
  });

  return app;
}
