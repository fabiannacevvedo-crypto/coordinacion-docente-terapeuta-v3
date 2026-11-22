import { PresentacionAdaptadaModel, AlumnoModel, UserModel } from "../models/index.js";

/**
 * Listar presentaciones adaptadas creadas para los alumnos
 */
export const getPresentaciones = async (req, res) => {
  try {
    const { alumno_id } = req.query;
    const where = {};
    if (alumno_id) where.alumno_id = alumno_id;

    const presentaciones = await PresentacionAdaptadaModel.findAll({
      where,
      include: [
        {
          model: AlumnoModel,
          as: "alumno",
          attributes: ["id", "nombre", "apellido", "sala_grado", "diagnostico"],
        },
        {
          model: UserModel,
          as: "docente",
          attributes: ["id", "nombre", "apellido"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      ok: true,
      total: presentaciones.length,
      presentaciones,
    });
  } catch (error) {
    console.error("Error en getPresentaciones:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error al obtener presentaciones adaptadas",
      error: error.message,
    });
  }
};

/**
 * Crear una nueva presentación adaptada para el alumno (exclusivo en el panel del Docente)
 */
export const createPresentacion = async (req, res) => {
  try {
    const {
      titulo,
      objetivo_pedagogico,
      alumno_id,
      perfil_sensorial_tdah,
      diapositivas,
      compartida_con_familia,
    } = req.body;

    if (!titulo || !objetivo_pedagogico) {
      return res.status(400).json({
        ok: false,
        mensaje: "El título y el objetivo pedagógico son obligatorios",
      });
    }

    const slidesData = Array.isArray(diapositivas)
      ? JSON.stringify(diapositivas)
      : typeof diapositivas === "string"
      ? diapositivas
      : JSON.stringify([]);

    const nueva = await PresentacionAdaptadaModel.create({
      titulo,
      objetivo_pedagogico,
      alumno_id: alumno_id ? Number(alumno_id) : null,
      docente_id: req.user.id,
      perfil_sensorial_tdah:
        perfil_sensorial_tdah || "Bajo Estímulo Visual + Secuencia Paso a Paso (TDAH)",
      diapositivas_json: slidesData,
      compartida_con_familia: compartida_con_familia !== undefined ? compartida_con_familia : true,
    });

    const completa = await PresentacionAdaptadaModel.findByPk(nueva.id, {
      include: [
        { model: AlumnoModel, as: "alumno", attributes: ["id", "nombre", "apellido", "sala_grado"] },
        { model: UserModel, as: "docente", attributes: ["id", "nombre", "apellido"] },
      ],
    });

    return res.status(201).json({
      ok: true,
      mensaje: "Presentación adaptada creada exitosamente para el alumno",
      presentacion: completa,
    });
  } catch (error) {
    console.error("Error en createPresentacion:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al crear la presentación adaptada",
      error: error.message,
    });
  }
};

/**
 * Eliminar presentación adaptada
 */
export const deletePresentacion = async (req, res) => {
  try {
    const { id } = req.params;
    const pres = await PresentacionAdaptadaModel.findByPk(id);
    if (!pres) {
      return res.status(404).json({ ok: false, mensaje: "Presentación no encontrada" });
    }
    await pres.destroy();
    return res.status(200).json({ ok: true, mensaje: "Presentación eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar presentación", error: error.message });
  }
};
