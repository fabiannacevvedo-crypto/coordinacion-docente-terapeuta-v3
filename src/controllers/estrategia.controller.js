import { EstrategiaModel, AlumnoEstrategiaModel, AlumnoModel } from "../models/index.js";

/**
 * Listar el catálogo de estrategias psicopedagógicas y sensoriales
 */
export const getEstrategias = async (req, res) => {
  try {
    const { categoria } = req.query;
    const where = {};
    if (categoria) where.categoria = categoria;

    const estrategias = await EstrategiaModel.findAll({
      where,
      order: [["categoria", "ASC"], ["nombre", "ASC"]],
    });

    return res.status(200).json({
      ok: true,
      total: estrategias.length,
      estrategias,
    });
  } catch (error) {
    console.error("Error en getEstrategias:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener las estrategias",
      error: error.message,
    });
  }
};

/**
 * Asociar una estrategia a un alumno
 */
export const asociarEstrategiaAAlumno = async (req, res) => {
  try {
    const { alumno_id, estrategia_id, efectividad, notas } = req.body;

    const [asociacion, creada] = await AlumnoEstrategiaModel.findOrCreate({
      where: { alumno_id, estrategia_id },
      defaults: {
        efectividad: efectividad || "ALTA",
        notas: notas || "Estrategia aplicada con éxito",
      },
    });

    if (!creada) {
      await asociacion.update({ efectividad, notas });
    }

    return res.status(200).json({
      ok: true,
      mensaje: "Estrategia asignada al alumno con éxito",
      asociacion,
    });
  } catch (error) {
    console.error("Error en asociarEstrategiaAAlumno:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al asociar la estrategia",
      error: error.message,
    });
  }
};
