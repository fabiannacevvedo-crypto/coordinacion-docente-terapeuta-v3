import { verifyToken } from "../helpers/jwt.helper.js";
import { UserModel, RoleModel } from "../models/index.js";

/**
 * Middleware para verificar la autenticación del usuario mediante JWT
 * Acepta el token tanto desde cookies (httpOnly) como desde el header Authorization
 */
export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        ok: false,
        mensaje: "Acceso no autorizado: No se proporcionó token de sesión",
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        ok: false,
        mensaje: "Sesión inválida o expirada. Por favor, inicie sesión nuevamente.",
      });
    }

    // Buscar usuario en base de datos (con paranoid: true para ignorar eliminados lógicamente)
    const user = await UserModel.findByPk(decoded.id, {
      include: [
        {
          model: RoleModel,
          as: "roles",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        ok: false,
        mensaje: "El usuario ya no existe o su cuenta fue desactivada",
      });
    }

    req.user = user;
    req.roles = user.roles ? user.roles.map((r) => r.name) : [];
    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al verificar autenticación",
      error: error.message,
    });
  }
};

export default authMiddleware;
