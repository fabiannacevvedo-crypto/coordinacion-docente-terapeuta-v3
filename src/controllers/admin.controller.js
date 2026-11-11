import {
  UserModel,
  DocentePerfilModel,
  TerapeutaPerfilModel,
  FamiliarPerfilModel,
  AlumnoModel,
  ReporteModel,
  AlertaCoordinacionModel,
} from "../models/index.js";

/**
 * Obtener estadísticas globales de la plataforma
 */
export const getEstadisticas = async (req, res) => {
  try {
    const totalUsuarios = await UserModel.count();
    const usuariosPendientes = await UserModel.count({ where: { estado_verificacion: "PENDIENTE" } });
    const totalAlumnos = await AlumnoModel.count();
    const totalReportes = await ReporteModel.count();
    const alertasPendientes = await AlertaCoordinacionModel.count({ where: { estado: "PENDIENTE" } });

    // Distribución por semáforo actual de los alumnos
    const alumnosVerde = await AlumnoModel.count({ where: { semaforo_actual: "VERDE" } });
    const alumnosAmarillo = await AlumnoModel.count({ where: { semaforo_actual: "AMARILLO" } });
    const alumnosRojo = await AlumnoModel.count({ where: { semaforo_actual: "ROJO" } });

    return res.status(200).json({
      ok: true,
      estadisticas: {
        totalUsuarios,
        usuariosPendientes,
        totalAlumnos,
        totalReportes,
        alertasPendientes,
        semaforoDistribucion: {
          verde: alumnosVerde,
          amarillo: alumnosAmarillo,
          rojo: alumnosRojo,
        },
      },
    });
  } catch (error) {
    console.error("Error en getEstadisticas:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener estadísticas",
      error: error.message,
    });
  }
};

/**
 * Aprobar o rechazar la verificación de un usuario
 */
export const resolverVerificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_verificacion, motivo_rechazo } = req.body;

    if (!["APROBADO", "RECHAZADO"].includes(estado_verificacion)) {
      return res.status(400).json({
        ok: false,
        mensaje: "El estado de verificación debe ser APROBADO o RECHAZADO",
      });
    }

    const usuario = await UserModel.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: `Usuario con ID ${id} no encontrado`,
      });
    }

    await usuario.update({
      estado_verificacion,
      motivo_rechazo: estado_verificacion === "RECHAZADO" ? motivo_rechazo || "Documentación insuficiente" : null,
    });

    return res.status(200).json({
      ok: true,
      mensaje: `Usuario ${usuario.nombre} ${usuario.apellido} ${estado_verificacion.toLowerCase()} exitosamente`,
      usuario,
    });
  } catch (error) {
    console.error("Error en resolverVerificacion:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al resolver la verificación",
      error: error.message,
    });
  }
};
