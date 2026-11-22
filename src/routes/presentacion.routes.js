import { Router } from "express";
import {
  getPresentaciones,
  createPresentacion,
  deletePresentacion,
} from "../controllers/presentacion.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getPresentaciones);
router.post("/", createPresentacion);
router.delete("/:id", deletePresentacion);

export default router;
