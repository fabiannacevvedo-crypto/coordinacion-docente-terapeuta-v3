import { Router } from "express";
import { getMensajes, createMensaje } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getMensajes);
router.post("/", createMensaje);

export default router;
