/**
 * Middleware para autorización basada en roles (RBAC)
 * @param  {...string} rolesPermitidos - Lista de nombres de rol autorizados
 */
export const checkRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !req.roles) {
      return res.status(401).json({
        ok: false,
        mensaje: "Acceso no autorizado: Debe iniciar sesión primero",
      });
    }

    // El rol ADMIN siempre tiene acceso maestro
    const esAdmin = req.roles.includes("ADMIN");
    if (esAdmin) {
      return next();
    }

    const tieneRol = rolesPermitidos.some((rol) => req.roles.includes(rol));
    if (!tieneRol) {
      return res.status(403).json({
        ok: false,
        mensaje: `Acceso denegado: Se requiere alguno de los siguientes roles: ${rolesPermitidos.join(", ")}`,
      });
    }

    next();
  };
};

export const isAdmin = checkRole("ADMIN");
export const isDocente = checkRole("DOCENTE");
export const isTerapeuta = checkRole("TERAPEUTA");
export const isFamiliar = checkRole("FAMILIAR");
export const isProfesional = checkRole("DOCENTE", "TERAPEUTA");

export default checkRole;
