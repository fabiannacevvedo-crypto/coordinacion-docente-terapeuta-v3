import { Router } from "express";
import { getEstrategias, asociarEstrategiaAAlumno } from "../controllers/estrategia.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isProfesional } from "../middlewares/roles.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getEstrategias);
router.post("/asociar", isProfesional, asociarEstrategiaAAlumno);

export default router;
