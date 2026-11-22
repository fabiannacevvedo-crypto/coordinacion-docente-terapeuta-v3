import { matchedData } from "express-validator";
import {
  AlumnoModel,
  UserModel,
  RoleModel,
  VinculoAlumnoModel,
  ReporteModel,
  EstrategiaModel,
  AlertaCoordinacionModel,
} from "../models/index.js";

/**
 * Listar alumnos accesibles para el usuario logueado
 * Docente: ve sus alumnos asignados o de su sala
 * Terapeuta: ve sus casos asignados
 * Familiar: ve únicamente sus hijos/tutelados vinculados
 * Admin: ve todos los alumnos
 */
export const getAllAlumnos = async (req, res) => {
  try {
    const esAdmin = req.roles.includes("ADMIN");
    const esFamiliar = req.roles.includes("FAMILIAR") && !esAdmin;

    let alumnos;

    if (esAdmin) {
      alumnos = await AlumnoModel.findAll({
        include: [
          {
            model: UserModel,
            as: "equipo_interdisciplinario",
            attributes: ["id", "nombre", "apellido", "email"],
            through: { attributes: ["tipo_vinculo", "estado"] },
          },
          {
            model: EstrategiaModel,
            as: "estrategias",
            through: { attributes: ["efectividad", "notas"] },
          },
        ],
        order: [["nombre", "ASC"]],
      });
    } else {
      // Buscar alumnos vinculados al usuario
      const vinculos = await VinculoAlumnoModel.findAll({
        where: { user_id: req.user.id, estado: "ACTIVO" },
      });
      const alumnoIds = vinculos.map((v) => v.alumno_id);

      alumnos = await AlumnoModel.findAll({
        where: alumnoIds.length > 0 ? { id: alumnoIds } : {},
        include: [
          {
            model: UserModel,
            as: "equipo_interdisciplinario",
            attributes: ["id", "nombre", "apellido", "email"],
            through: { attributes: ["tipo_vinculo", "estado"] },
          },
          {
            model: EstrategiaModel,
            as: "estrategias",
            through: { attributes: ["efectividad", "notas"] },
          },
          {
            model: ReporteModel,
            as: "reportes",
            limit: 3,
            order: [["created_at", "DESC"]],
          },
        ],
        order: [["nombre", "ASC"]],
      });
    }

    return res.status(200).json({
      ok: true,
      total: alumnos.length,
      alumnos,
    });
  } catch (error) {
    console.error("Error en getAllAlumnos:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener los alumnos",
      error: error.message,
    });
  }
};

/**
 * Obtener un alumno por su ID con todo el historial de reportes, alertas y equipo
 */
export const getAlumnoById = async (req, res) => {
  try {
    const { id } = req.params;

    const alumno = await AlumnoModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "equipo_interdisciplinario",
          attributes: ["id", "nombre", "apellido", "email", "telefono"],
          through: { attributes: ["tipo_vinculo", "estado"] },
        },
        {
          model: EstrategiaModel,
          as: "estrategias",
          through: { attributes: ["efectividad", "notas"] },
        },
        {
          model: ReporteModel,
          as: "reportes",
          include: [
            {
              model: UserModel,
              as: "autor",
              attributes: ["id", "nombre", "apellido"],
            },
          ],
          order: [["created_at", "DESC"]],
        },
        {
          model: AlertaCoordinacionModel,
          as: "alertas",
          order: [["created_at", "DESC"]],
          limit: 5,
        },
      ],
    });

    if (!alumno) {
      return res.status(404).json({
        ok: false,
        mensaje: `Alumno con ID ${id} no encontrado`,
      });
    }

    return res.status(200).json({
      ok: true,
      alumno,
    });
  } catch (error) {
    console.error("Error en getAlumnoById:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener el alumno",
      error: error.message,
    });
  }
};

/**
 * Crear nuevo alumno
 */
export const createAlumno = async (req, res) => {
  try {
    const data = matchedData(req);

    // Generar código familiar único si no fue provisto
    if (!data.codigo_familiar) {
      data.codigo_familiar = `FAM-${data.nombre.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    if (data.ficha_medica && typeof data.ficha_medica === "object") {
      data.ficha_medica = JSON.stringify(data.ficha_medica);
    }
    if (data.sincronizador_matutino && typeof data.sincronizador_matutino === "object") {
      data.sincronizador_matutino = JSON.stringify(data.sincronizador_matutino);
    }
    if (data.agenda_diaria && typeof data.agenda_diaria === "object") {
      data.agenda_diaria = JSON.stringify(data.agenda_diaria);
    }

    const nuevoAlumno = await AlumnoModel.create(data);

    // Si el creador es Docente o Terapeuta, vincularlo automáticamente
    const rolCreador = req.roles.includes("DOCENTE")
      ? "DOCENTE_AULA"
      : req.roles.includes("TERAPEUTA")
      ? "TERAPEUTA_ACOMPANIANTE"
      : "DOCENTE_AULA";

    await VinculoAlumnoModel.create({
      alumno_id: nuevoAlumno.id,
      user_id: req.user.id,
      tipo_vinculo: rolCreador,
      estado: "ACTIVO",
    });

    // Vincular también al Terapeuta y Tutor Familiar activos para asegurar coordinación inmediata
    const terapeutas = await UserModel.findAll({
      include: [{ model: RoleModel, as: "roles", where: { name: "TERAPEUTA" } }],
      limit: 1,
    });
    if (terapeutas.length > 0 && terapeutas[0].id !== req.user.id) {
      await VinculoAlumnoModel.findOrCreate({
        where: { alumno_id: nuevoAlumno.id, user_id: terapeutas[0].id },
        defaults: {
          alumno_id: nuevoAlumno.id,
          user_id: terapeutas[0].id,
          tipo_vinculo: "TERAPEUTA_ACOMPANIANTE",
          estado: "ACTIVO",
        },
      });
    }

    return res.status(201).json({
      ok: true,
      mensaje: "Alumno registrado exitosamente en SincroAula",
      alumno: nuevoAlumno,
    });
  } catch (error) {
    console.error("Error en createAlumno:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al crear el alumno",
      error: error.message,
    });
  }
};

/**
 * Actualizar datos del alumno (soporta cambio rápido de semáforo emocional)
 */
export const updateAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const datosValidados = matchedData(req);

    const alumno = await AlumnoModel.findByPk(id);
    if (!alumno) {
      return res.status(404).json({
        ok: false,
        mensaje: `Alumno con ID ${id} no encontrado`,
      });
    }

    if (datosValidados.ficha_medica && typeof datosValidados.ficha_medica === "object") {
      datosValidados.ficha_medica = JSON.stringify(datosValidados.ficha_medica);
    }
    if (datosValidados.sincronizador_matutino && typeof datosValidados.sincronizador_matutino === "object") {
      datosValidados.sincronizador_matutino = JSON.stringify(datosValidados.sincronizador_matutino);
    }
    if (datosValidados.agenda_diaria && typeof datosValidados.agenda_diaria === "object") {
      datosValidados.agenda_diaria = JSON.stringify(datosValidados.agenda_diaria);
    }

    await alumno.update(datosValidados);

    return res.status(200).json({
      ok: true,
      mensaje: "Datos del alumno actualizados exitosamente",
      alumno,
    });
  } catch (error) {
    console.error("Error en updateAlumno:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al actualizar alumno",
      error: error.message,
    });
  }
};

/**
 * Eliminación lógica (Soft delete) del alumno
 */
export const deleteAlumno = async (req, res) => {
  try {
    const { id } = req.params;

    const alumno = await AlumnoModel.findByPk(id);
    if (!alumno) {
      return res.status(404).json({
        ok: false,
        mensaje: `Alumno con ID ${id} no encontrado`,
      });
    }

    await alumno.destroy();

    return res.status(200).json({
      ok: true,
      mensaje: `Alumno con ID ${id} eliminado lógicamente. Los datos históricos se conservan para legajo.`,
    });
  } catch (error) {
    console.error("Error en deleteAlumno:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al eliminar alumno",
      error: error.message,
    });
  }
};

/**
 * Vincular un profesional o familiar a un alumno
 */
export const vincularUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, tipo_vinculo } = req.body;

    const vinculo = await VinculoAlumnoModel.create({
      alumno_id: id,
      user_id,
      tipo_vinculo: tipo_vinculo || "TERAPEUTA_ACOMPANIANTE",
      estado: "ACTIVO",
    });

    return res.status(201).json({
      ok: true,
      mensaje: "Usuario vinculado al alumno exitosamente",
      vinculo,
    });
  } catch (error) {
    console.error("Error en vincularUsuario:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al vincular usuario",
      error: error.message,
    });
  }
};
