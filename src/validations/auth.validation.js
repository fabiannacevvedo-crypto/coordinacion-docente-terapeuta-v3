import { body } from "express-validator";

export const registerValidation = [
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
    .trim()
    .isLength({ min: 6, max: 30 })
    .withMessage("El formato del teléfono no es válido"),

  // Campos específicos Docente
  body("institucion")
    .if(body("rol").equals("DOCENTE"))
    .notEmpty()
    .withMessage("La institución educativa es obligatoria para docentes"),

  body("cue_escuela")
    .if(body("rol").equals("DOCENTE"))
    .notEmpty()
    .withMessage("El CUE de la escuela es obligatorio"),

  body("cargo")
    .if(body("rol").equals("DOCENTE"))
    .notEmpty()
    .withMessage("El cargo docente es obligatorio"),

  // Campos específicos Terapeuta
  body("especialidad")
    .if(body("rol").equals("TERAPEUTA"))
    .notEmpty()
    .withMessage("La especialidad terapéutica es obligatoria"),

  body("matricula_numero")
    .if(body("rol").equals("TERAPEUTA"))
    .notEmpty()
    .withMessage("El número de matrícula profesional es obligatorio"),

  body("colegio_profesional")
    .if(body("rol").equals("TERAPEUTA"))
    .notEmpty()
    .withMessage("El colegio profesional o entidad habilitante es obligatoria"),

  // Campos específicos Familiar / Tutor
  body("dni")
    .if(body("rol").equals("FAMILIAR"))
    .notEmpty()
    .withMessage("El DNI del familiar o tutor es obligatorio"),

  body("parentesco")
    .if(body("rol").equals("FAMILIAR"))
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
