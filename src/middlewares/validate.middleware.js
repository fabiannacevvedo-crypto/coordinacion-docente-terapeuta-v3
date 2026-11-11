import { validationResult } from "express-validator";

/**
 * Middleware para validar resultados de express-validator
 * Retorna 400 Bad Request si existen errores de validación
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const primerError = errors.array()[0].msg;
    return res.status(400).json({
      ok: false,
      mensaje: primerError,
      errores: errors.array().map((err) => ({
        campo: err.path || err.param,
        mensaje: err.msg,
      })),
    });
  }
  next();
};

export default handleValidationErrors;
