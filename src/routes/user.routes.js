import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
} from "../controllers/user.controller.js";
import {
  idParamValidation,
  createUserValidation,
  updateUserValidation,
} from "../validations/user.validation.js";
import { handleValidationErrors } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

// Todas las rutas de gestión de usuarios requieren autenticación
router.use(authMiddleware);

// Rutas administrativas de gestión de usuarios
router.get("/", getAllUsers);
router.get("/:id", idParamValidation, handleValidationErrors, getUserById);
router.post("/", isAdmin, createUserValidation, handleValidationErrors, createUser);
router.put("/:id", isAdmin, updateUserValidation, handleValidationErrors, updateUser);
router.delete("/:id", isAdmin, idParamValidation, handleValidationErrors, deleteUser);
router.post("/:id/restore", isAdmin, idParamValidation, handleValidationErrors, restoreUser);

export default router;
