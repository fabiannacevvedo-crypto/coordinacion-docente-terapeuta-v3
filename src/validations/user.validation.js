import { body, param } from "express-validator";

export const idParamValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID del recurso debe ser un número entero positivo"),
];

export const createUserValidation = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("apellido")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio")
    .isEmail()
    .withMessage("Debe proporcionar un email válido")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("rol")
    .notEmpty()
    .withMessage("El rol es obligatorio")
    .isIn(["ADMIN", "DOCENTE", "TERAPEUTA", "FAMILIAR"])
    .withMessage("Rol no válido"),
];

export const updateUserValidation = [
  ...idParamValidation,

  body("nombre")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("apellido")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Debe proporcionar un email válido")
    .normalizeEmail(),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("telefono")
    .optional()
    .trim(),

  body("estado_verificacion")
    .optional()
    .isIn(["PENDIENTE", "APROBADO", "RECHAZADO"])
    .withMessage("Estado de verificación no válido"),

  body("motivo_rechazo")
    .optional()
    .trim(),
];
