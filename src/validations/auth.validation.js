import { body } from "express-validator";

export const registerValidation = [
  body("nombre")
    .optional({ checkFalsy: true })
    .trim(),

  body("apellido")
    .optional({ checkFalsy: true })
    .trim(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio")
    .isEmail()
    .withMessage("Ingrese un correo electrónico válido")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("rol")
    .notEmpty()
    .withMessage("Debe seleccionar un rol para registrarse")
    .isIn(["DOCENTE", "TERAPEUTA", "FAMILIAR", "ADMIN"])
    .withMessage("El rol debe ser DOCENTE, TERAPEUTA, FAMILIAR o ADMIN"),

  body("telefono")
    .optional({ checkFalsy: true })
    .trim(),

  // Campos específicos Docente
  body("institucion")
    .optional({ checkFalsy: true })
    .trim(),

  body("cue_escuela")
    .optional({ checkFalsy: true })
    .trim(),

  body("cargo")
    .optional({ checkFalsy: true })
    .trim(),

  // Campos específicos Terapeuta
  body("especialidad")
    .optional({ checkFalsy: true })
    .trim(),

  body("matricula_numero")
    .optional({ checkFalsy: true })
    .trim(),

  body("colegio_profesional")
    .optional({ checkFalsy: true })
    .trim(),

  // Campos específicos Familiar / Tutor
  body("dni")
    .optional({ checkFalsy: true })
    .trim(),

  body("parentesco")
    .optional({ checkFalsy: true })
    .isIn(["MADRE", "PADRE", "TUTOR_LEGAL", "FAMILIAR"])
    .withMessage("El parentesco debe ser MADRE, PADRE, TUTOR_LEGAL o FAMILIAR"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio")
    .isEmail()
    .withMessage("Ingrese un correo electrónico válido")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),
];
