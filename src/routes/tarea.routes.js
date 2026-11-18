import { Router } from "express";
import {
  getTareas,
  createTarea,
  adaptarTareaTerapeuta,
  reportarActividadTutor,
} from "../controllers/tarea.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getTareas);
router.post("/", createTarea);
router.put("/:id/adaptar", adaptarTareaTerapeuta);
router.put("/:id/reporte-tutor", reportarActividadTutor);

export default router;
