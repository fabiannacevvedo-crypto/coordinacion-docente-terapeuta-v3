import { matchedData } from "express-validator";
import { ReporteModel, UserModel, AlumnoModel } from "../models/index.js";

/**
 * Listar reportes con filtros
 */
export const getAllReportes = async (req, res) => {
  try {
    const { alumno_id, fecha, semaforo } = req.query;
    const where = {};

    if (alumno_id) where.alumno_id = alumno_id;
    if (fecha) where.fecha = fecha;
    if (semaforo) where.semaforo_emocional = semaforo;

    // Si es familiar, solo reportes compartidos
    const esFamiliar = req.roles.includes("FAMILIAR") && !req.roles.includes("ADMIN");
    if (esFamiliar) {
      where.compartido_con_familia = true;
    }

    const reportes = await ReporteModel.findAll({
      where,
      include: [
        {
          model: UserModel,
          as: "autor",
          attributes: ["id", "nombre", "apellido", "email"],
        },
        {
          model: AlumnoModel,
          as: "alumno",
          attributes: ["id", "nombre", "apellido", "sala_grado"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      ok: true,
      total: reportes.length,
      reportes,
    });
  } catch (error) {
    console.error("Error en getAllReportes:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener los reportes",
      error: error.message,
    });
  }
};

/**
 * Obtener un reporte por ID
 */
export const getReporteById = async (req, res) => {
  try {
    const { id } = req.params;

    const reporte = await ReporteModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "autor",
          attributes: ["id", "nombre", "apellido"],
        },
        {
          model: AlumnoModel,
          as: "alumno",
          attributes: ["id", "nombre", "apellido", "sala_grado", "semaforo_actual"],
        },
      ],
    });

    if (!reporte) {
      return res.status(404).json({
        ok: false,
        mensaje: `Reporte con ID ${id} no encontrado`,
      });
    }

    return res.status(200).json({
      ok: true,
      reporte,
    });
  } catch (error) {
    console.error("Error en getReporteById:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener el reporte",
      error: error.message,
    });
  }
};

/**
 * Crear un nuevo reporte u observación en la bitácora
 */
export const createReporte = async (req, res) => {
  try {
    const data = matchedData(req);

    // Asociar al usuario autenticado como autor
    const nuevoReporte = await ReporteModel.create({
      ...data,
      autor_id: req.user.id,
    });

    // Actualizar también el semáforo actual del alumno para reflejar el estado en vivo
    if (data.semaforo_emocional && data.alumno_id) {
      await AlumnoModel.update(
        { semaforo_actual: data.semaforo_emocional },
        { where: { id: data.alumno_id } }
      );
    }

    return res.status(201).json({
      ok: true,
      mensaje: "Reporte diario registrado exitosamente en la bitácora",
      reporte: nuevoReporte,
    });
  } catch (error) {
    console.error("Error en createReporte:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al crear el reporte",
      error: error.message,
    });
  }
};

/**
 * Actualizar reporte
 */
export const updateReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const datosValidados = matchedData(req);

    const reporte = await ReporteModel.findByPk(id);
    if (!reporte) {
      return res.status(404).json({
        ok: false,
        mensaje: `Reporte con ID ${id} no encontrado`,
      });
    }

    // Solo el autor o un admin puede editar el reporte
    const esAutor = reporte.autor_id === req.user.id;
    const esAdmin = req.roles.includes("ADMIN");
    if (!esAutor && !esAdmin) {
      return res.status(403).json({
        ok: false,
        mensaje: "No posee permisos para modificar este reporte",
      });
    }

    await reporte.update(datosValidados);

    return res.status(200).json({
      ok: true,
      mensaje: "Reporte actualizado exitosamente",
      reporte,
    });
  } catch (error) {
    console.error("Error en updateReporte:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al actualizar el reporte",
      error: error.message,
    });
  }
};

/**
 * Eliminación lógica (Soft delete) del reporte
 */
export const deleteReporte = async (req, res) => {
  try {
    const { id } = req.params;

    const reporte = await ReporteModel.findByPk(id);
    if (!reporte) {
      return res.status(404).json({
        ok: false,
        mensaje: `Reporte con ID ${id} no encontrado`,
      });
    }

    const esAutor = reporte.autor_id === req.user.id;
    const esAdmin = req.roles.includes("ADMIN");
    if (!esAutor && !esAdmin) {
      return res.status(403).json({
        ok: false,
        mensaje: "No posee permisos para eliminar este reporte",
      });
    }

    await reporte.destroy();

    return res.status(200).json({
      ok: true,
      mensaje: `Reporte con ID ${id} eliminado lógicamente de la bitácora`,
    });
  } catch (error) {
    console.error("Error en deleteReporte:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al eliminar el reporte",
      error: error.message,
    });
  }
};
