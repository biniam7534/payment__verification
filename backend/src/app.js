import cors from "cors";
import express from "express";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import notFound from "./middlewares/notFound.js";
import { createUserRouter } from "./routes/userRoutes.js";

export function createApp(pool) {
  const app = express();
  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : false }));
  app.use(express.json({ limit: "1mb" }));

  const healthCheck = async (_req, res) => {
    try {
      await pool.query("SELECT 1");
      return res.json({
        success: true,
        message: "Backend and PostgreSQL connected successfully",
      });
    } catch (error) {
      console.error("Health check could not reach PostgreSQL:", error);
      return res.status(503).json({
        success: false,
        message: "Database connection failed",
      });
    }
  };

  app.get("/api/health", healthCheck);
  app.get("/health", healthCheck);
  app.use("/api/users", createUserRouter(pool));

  app.use(notFound);
  app.use(errorMiddleware);

  return app;
}
