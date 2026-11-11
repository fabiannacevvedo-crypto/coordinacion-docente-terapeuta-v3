import { Router } from "express";
import {
  getAllReportes,
  getReporteById,
  createReporte,
  updateReporte,
  deleteReporte,
} from "../controllers/reporte.controller.js";
import {
  reporteIdParamValidation,
  createReporteValidation,
  updateReporteValidation,
} from "../validations/reporte.validation.js";
import { handleValidationErrors } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isProfesional } from "../middlewares/roles.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllReportes);
router.get("/:id", reporteIdParamValidation, handleValidationErrors, getReporteById);
router.post("/", isProfesional, createReporteValidation, handleValidationErrors, createReporte);
router.put("/:id", isProfesional, updateReporteValidation, handleValidationErrors, updateReporte);
router.delete("/:id", isProfesional, reporteIdParamValidation, handleValidationErrors, deleteReporte);

export default router;
