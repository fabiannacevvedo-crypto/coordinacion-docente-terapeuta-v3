import { body, param } from "express-validator";

export const alertaIdParamValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID de la alerta debe ser un número entero"),
];

export const createAlertaValidation = [
  body("alumno_id")
    .notEmpty()
    .withMessage("El ID del alumno es obligatorio")
    .isInt({ min: 1 }),

  body("tipo_alerta")
    .notEmpty()
    .withMessage("El tipo de alerta es obligatorio")
    .isIn(["DESREGULACION", "SOBRECARGA_SENSORIAL", "CAMBIO_ACTIVIDAD", "LOGRO_DESTACADO", "CONSULTA_URGENTE"]),

  body("mensaje")
    .trim()
    .notEmpty()
    .withMessage("El mensaje de la alerta es obligatorio")
    .isLength({ min: 3, max: 255 }),

  body("nivel_urgencia")
    .optional()
    .isIn(["ALTA", "MEDIA", "INFORMATIVA"]),

  body("receptor_rol")
    .optional()
    .isIn(["TERAPEUTA", "DOCENTE", "TODOS"]),
];
