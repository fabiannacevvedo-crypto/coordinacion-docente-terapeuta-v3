import { Router } from "express";
import { getAlertas, createAlerta, atenderAlerta } from "../controllers/alerta.controller.js";
import { alertaIdParamValidation, createAlertaValidation } from "../validations/alerta.validation.js";
import { handleValidationErrors } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isProfesional } from "../middlewares/roles.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getAlertas);
router.post("/", isProfesional, createAlertaValidation, handleValidationErrors, createAlerta);
router.put("/:id/atender", isProfesional, alertaIdParamValidation, handleValidationErrors, atenderAlerta);

export default router;
