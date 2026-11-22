import { Router } from "express";
import {
  getAllAlumnos,
  getAlumnoById,
  createAlumno,
  updateAlumno,
  deleteAlumno,
  vincularUsuario,
} from "../controllers/alumno.controller.js";
import {
  alumnoIdParamValidation,
  createAlumnoValidation,
  updateAlumnoValidation,
} from "../validations/alumno.validation.js";
import { handleValidationErrors } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isProfesional, isAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllAlumnos);
router.get("/:id", alumnoIdParamValidation, handleValidationErrors, getAlumnoById);
router.post("/", isProfesional, createAlumnoValidation, handleValidationErrors, createAlumno);
router.put("/:id", updateAlumnoValidation, handleValidationErrors, updateAlumno);
router.delete("/:id", isAdmin, alumnoIdParamValidation, handleValidationErrors, deleteAlumno);
router.post("/:id/vincular", isProfesional, alumnoIdParamValidation, handleValidationErrors, vincularUsuario);

export default router;
