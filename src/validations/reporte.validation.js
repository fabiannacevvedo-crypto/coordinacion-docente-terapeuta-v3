import { body, param } from "express-validator";

export const reporteIdParamValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID del reporte debe ser un número entero positivo"),
];

export const createReporteValidation = [
  body("alumno_id")
    .notEmpty()
    .withMessage("El ID del alumno es obligatorio")
    .isInt({ min: 1 })
    .withMessage("ID de alumno no válido"),

  body("semaforo_emocional")
    .notEmpty()
    .withMessage("El semáforo emocional es obligatorio")
    .isIn(["VERDE", "AMARILLO", "ROJO"])
    .withMessage("El semáforo debe ser VERDE, AMARILLO o ROJO"),

  body("titulo")
    .trim()
    .notEmpty()
    .withMessage("El título del reporte es obligatorio")
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres"),

  body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("La descripción de la observación es obligatoria")
    .isLength({ min: 10 })
    .withMessage("La descripción debe tener al menos 10 caracteres"),

  body("estrategia_utilizada")
    .optional()
    .trim(),

  body("respuesta_alumno")
    .optional()
    .trim(),

  body("compartido_con_familia")
    .optional()
    .isBoolean()
    .withMessage("compartido_con_familia debe ser booleano"),
];

export const updateReporteValidation = [
  ...reporteIdParamValidation,

  body("semaforo_emocional")
    .optional()
    .isIn(["VERDE", "AMARILLO", "ROJO"]),

  body("titulo")
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 }),

  body("descripcion")
    .optional()
    .trim()
    .isLength({ min: 10 }),

  body("estrategia_utilizada")
    .optional()
    .trim(),

  body("respuesta_alumno")
    .optional()
    .trim(),

  body("compartido_con_familia")
    .optional()
    .isBoolean(),
];
