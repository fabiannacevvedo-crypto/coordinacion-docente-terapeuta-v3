import { Router } from "express";
import { getEstadisticas, resolverVerificacion } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(isAdmin);

router.get("/estadisticas", getEstadisticas);
router.put("/usuarios/:id/verificacion", resolverVerificacion);

export default router;
