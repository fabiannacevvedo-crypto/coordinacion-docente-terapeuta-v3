import { body, param } from "express-validator";

export const alumnoIdParamValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID del alumno debe ser un número entero positivo"),
];

export const createAlumnoValidation = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre del alumno es obligatorio")
    .isLength({ min: 2, max: 60 })
    .withMessage("El nombre debe tener entre 2 y 60 caracteres"),

  body("apellido")
    .trim()
    .notEmpty()
    .withMessage("El apellido del alumno es obligatorio")
    .isLength({ min: 2, max: 60 })
    .withMessage("El apellido debe tener entre 2 y 60 caracteres"),

  body("sala_grado")
    .trim()
    .notEmpty()
    .withMessage("La sala o grado es obligatoria"),

  body("turno")
    .optional()
    .isIn(["MAÑANA", "TARDE", "JORNADA_COMPLETA"])
    .withMessage("Turno no válido"),

  body("semaforo_actual")
    .optional()
    .isIn(["VERDE", "AMARILLO", "ROJO"])
    .withMessage("El estado del semáforo debe ser VERDE, AMARILLO o ROJO"),

  body("diagnostico")
    .optional()
    .trim(),

  body("observaciones")
    .optional()
    .trim(),
];

export const updateAlumnoValidation = [
  ...alumnoIdParamValidation,

  body("nombre")
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 }),

  body("apellido")
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 }),

  body("sala_grado")
    .optional()
    .trim(),

  body("turno")
    .optional()
    .isIn(["MAÑANA", "TARDE", "JORNADA_COMPLETA"]),

  body("semaforo_actual")
    .optional()
    .isIn(["VERDE", "AMARILLO", "ROJO"]),

  body("diagnostico")
    .optional()
    .trim(),

  body("observaciones")
    .optional()
    .trim(),
];
