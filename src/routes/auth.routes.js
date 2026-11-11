import { Router } from "express";
import { register, login, getProfile, updateProfile, logout } from "../controllers/auth.controller.js";
import { registerValidation, loginValidation } from "../validations/auth.validation.js";
import { handleValidationErrors } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas de autenticación
router.post("/register", registerValidation, handleValidationErrors, register);
router.post("/login", loginValidation, handleValidationErrors, login);

// Rutas protegidas para el usuario autenticado
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/logout", authMiddleware, logout);

export default router;
