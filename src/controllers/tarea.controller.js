import {
  TareaModel,
  AlumnoModel,
  UserModel,
  VinculoAlumnoModel,
  RoleModel,
  MensajeChatModel,
  AlertaCoordinacionModel,
} from "../models/index.js";

/**
 * Obtener tareas según rol o filtros
 */
export const getTareas = async (req, res) => {
  try {
    const { alumno_id, estado } = req.query;
    const where = {};

    if (alumno_id) where.alumno_id = alumno_id;
    if (estado) where.estado = estado;

    const tareas = await TareaModel.findAll({
      where,
      include: [
        {
          model: AlumnoModel,
          as: "alumno",
          attributes: ["id", "nombre", "apellido", "sala_grado", "diagnostico", "codigo_familiar"],
          include: [
            {
              model: UserModel,
              as: "equipo_interdisciplinario",
              attributes: ["id", "nombre", "apellido", "email"],
              through: { attributes: ["tipo_vinculo", "estado"] },
            },
          ],
        },
        {
          model: UserModel,
          as: "docente",
          attributes: ["id", "nombre", "apellido", "email"],
        },
        {
          model: UserModel,
          as: "terapeuta",
          attributes: ["id", "nombre", "apellido", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      ok: true,
      total: tareas.length,
      tareas,
    });
  } catch (error) {
    console.error("Error en getTareas:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener las tareas",
      error: error.message,
    });
  }
};

/**
 * Docente crea una tarea (individual o en conjunto para varios/todos los alumnos)
 * La tarea se envía primero al Terapeuta (estado = PENDIENTE_TERAPEUTA) antes de llegar al tutor
 */
export const createTarea = async (req, res) => {
  try {
    const {
      titulo,
      consigna_original,
      tipo_asignacion,
      alumno_id,
      alumnos_ids,
      subtipo_tdah_objetivo,
      fecha_entrega,
    } = req.body;

    if (!titulo || !consigna_original) {
      return res.status(400).json({
        ok: false,
        mensaje: "El título y la consigna original de la tarea son obligatorios",
      });
    }

    let targetAlumnoIds = [];

    if (tipo_asignacion === "CONJUNTO") {
      if (Array.isArray(alumnos_ids) && alumnos_ids.length > 0) {
        targetAlumnoIds = alumnos_ids.map(Number);
      } else {
        const todos = await AlumnoModel.findAll({ attributes: ["id"] });
        targetAlumnoIds = todos.map((a) => a.id);
      }
    } else {
      if (!alumno_id) {
        return res.status(400).json({
          ok: false,
          mensaje: "Debe seleccionar un alumno para asignación individual",
        });
      }
      targetAlumnoIds = [Number(alumno_id)];
    }

    const tareasCreadas = [];

    for (const idAlum of targetAlumnoIds) {
      const nueva = await TareaModel.create({
        titulo,
        consigna_original,
        tipo_asignacion: tipo_asignacion || "INDIVIDUAL",
        alumno_id: idAlum,
        docente_id: req.user.id,
        subtipo_tdah_objetivo:
          subtipo_tdah_objetivo || "TDAH Combinado (Inatención + Impulsividad)",
        estado: "PENDIENTE_TERAPEUTA",
        fecha_entrega: fecha_entrega || new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      });

      // Emitir alerta automática al Terapeuta para que adapte la tarea antes de enviarla al tutor
      await AlertaCoordinacionModel.create({
        alumno_id: idAlum,
        emisor_id: req.user.id,
        receptor_rol: "TERAPEUTA",
        tipo_alerta: "CAMBIO_ACTIVIDAD",
        mensaje: `Nueva tarea asignada ("${titulo}") pendiente de adaptación terapéutica TDAH antes de enviar al tutor.`,
        nivel_urgencia: "MEDIA",
        estado: "PENDIENTE",
      });

      tareasCreadas.push(nueva);
    }

    return res.status(201).json({
      ok: true,
      mensaje:
        tipo_asignacion === "CONJUNTO"
          ? `Tarea en conjunto enviada al Terapeuta para adaptación TDAH (${tareasCreadas.length} alumnos)`
          : "Tarea enviada al Terapeuta para adaptación TDAH antes de ser remitida al Padre/Tutor",
      tareas: tareasCreadas,
    });
  } catch (error) {
    console.error("Error en createTarea:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al crear y enviar la tarea al terapeuta",
      error: error.message,
    });
  }
};

/**
 * Terapeuta adapta la tarea según pautas específicas orientadas al TDAH
 * Al guardar, cambia el estado a ADAPTADA_ENVIADA_TUTOR para que el Padre/Tutor la reciba
 */
export const adaptarTareaTerapeuta = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      subtipo_tdah_objetivo,
      pautas_tdah_aplicadas,
      adaptacion_terapeuta,
      recursos_apoyo,
    } = req.body;

    const tarea = await TareaModel.findByPk(id);
    if (!tarea) {
      return res.status(404).json({
        ok: false,
        mensaje: `Tarea con ID ${id} no encontrada`,
      });
    }

    if (!adaptacion_terapeuta) {
      return res.status(400).json({
        ok: false,
        mensaje: "Debe ingresar la consigna adaptada para el alumno con TDAH",
      });
    }

    await tarea.update({
      terapeuta_id: req.user.id,
      subtipo_tdah_objetivo: subtipo_tdah_objetivo || tarea.subtipo_tdah_objetivo,
      pautas_tdah_aplicadas:
        pautas_tdah_aplicadas ||
        "Micro-segmentación de instrucciones (Chunking) + Temporizador Visual Pomodoro + Doble Canal Sensorial",
      adaptacion_terapeuta,
      recursos_apoyo: recursos_apoyo || "Secuencia visual de 3 pasos + Pausas kinestésicas",
      estado: "ADAPTADA_ENVIADA_TUTOR",
    });

    // Registrar mensaje en el canal para notificar al Tutor y al Docente
    await MensajeChatModel.create({
      alumno_id: tarea.alumno_id,
      emisor_id: req.user.id,
      emisor_rol: "TERAPEUTA",
      destinatario_rol: "TODOS",
      contenido: `✅ Tarea adaptada para TDAH ("${tarea.titulo}") lista y enviada al Tutor Familiar. Pautas aplicadas: ${tarea.pautas_tdah_aplicadas}.`,
      tipo_mensaje: "PAUTA_TERAPEUTICA",
      tarea_id: tarea.id,
    });

    return res.status(200).json({
      ok: true,
      mensaje: "Tarea adaptada exitosamente con pautas TDAH y enviada al Padre/Tutor",
      tarea,
    });
  } catch (error) {
    console.error("Error en adaptarTareaTerapeuta:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al adaptar la tarea",
      error: error.message,
    });
  }
};

/**
 * Tutor Familiar envía reporte/mensaje sobre cómo estuvo su hijo en la actividad
 * Puede elegir enviarlo a AMBOS (Docente y Terapeuta) o específicamente a DOCENTE o TERAPEUTA
 */
export const reportarActividadTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      reporte_tutor,
      nivel_atencion_hogar,
      destinatario_reporte_tutor,
    } = req.body;

    const tarea = await TareaModel.findByPk(id);
    if (!tarea) {
      return res.status(404).json({
        ok: false,
        mensaje: `Tarea con ID ${id} no encontrada`,
      });
    }

    if (!reporte_tutor) {
      return res.status(400).json({
        ok: false,
        mensaje: "Por favor escriba cómo estuvo su hijo durante la actividad",
      });
    }

    const dest = destinatario_reporte_tutor || "AMBOS";

    await tarea.update({
      reporte_tutor,
      nivel_atencion_hogar: nivel_atencion_hogar || "ALTO_ENFOQUE",
      destinatario_reporte_tutor: dest,
      estado: "COMPLETADA_POR_TUTOR",
    });

    // También publicamos en el chat en tiempo real hacia el destinatario elegido
    await MensajeChatModel.create({
      alumno_id: tarea.alumno_id,
      emisor_id: req.user.id,
      emisor_rol: "FAMILIAR",
      destinatario_rol: dest === "AMBOS" ? "TODOS" : dest,
      contenido: `📋 Reporte Familiar sobre la tarea "${tarea.titulo}" (Atención: ${
        nivel_atencion_hogar || "ALTO_ENFOQUE"
      }): ${reporte_tutor}`,
      tipo_mensaje: "REPORTE_TAREA",
      tarea_id: tarea.id,
    });

    return res.status(200).json({
      ok: true,
      mensaje: `Reporte de actividad enviado exitosamente a: ${
        dest === "AMBOS" ? "Docente y Terapeuta" : dest
      }`,
      tarea,
    });
  } catch (error) {
    console.error("Error en reportarActividadTutor:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al enviar el reporte de la actividad",
      error: error.message,
    });
  }
};
