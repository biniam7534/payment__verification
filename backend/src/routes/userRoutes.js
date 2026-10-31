import { Router } from "express";
import { createUserController } from "../controllers/userController.js";

export function createUserRouter(pool) {
  const router = Router();
  const controller = createUserController(pool);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.get);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}