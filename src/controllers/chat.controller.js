import { MensajeChatModel, UserModel, AlumnoModel } from "../models/index.js";

/**
 * Listar mensajes en tiempo real por alumno o canal
 */
export const getMensajes = async (req, res) => {
  try {
    const { alumno_id, destinatario_rol } = req.query;
    const where = {};

    if (alumno_id) where.alumno_id = alumno_id;
    if (destinatario_rol) where.destinatario_rol = destinatario_rol;

    const mensajes = await MensajeChatModel.findAll({
      where,
      include: [
        {
          model: UserModel,
          as: "emisor",
          attributes: ["id", "nombre", "apellido", "email"],
        },
        {
          model: AlumnoModel,
          as: "alumno",
          attributes: ["id", "nombre", "apellido", "sala_grado"],
        },
      ],
      order: [["created_at", "ASC"]],
      limit: 100,
    });

    return res.status(200).json({
      ok: true,
      total: mensajes.length,
      mensajes,
    });
  } catch (error) {
    console.error("Error en getMensajes:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error al obtener mensajes de coordinación",
      error: error.message,
    });
  }
};

/**
 * Enviar un nuevo mensaje en tiempo real entre Docente, Terapeuta y Padre/Tutor
 */
export const createMensaje = async (req, res) => {
  try {
    const { alumno_id, destinatario_rol, contenido, tipo_mensaje, tarea_id } = req.body;

    if (!alumno_id || !contenido) {
      return res.status(400).json({
        ok: false,
        mensaje: "El alumno y el contenido del mensaje son obligatorios",
      });
    }

    const rolEmisor = req.roles?.[0] || "DOCENTE";

    const nuevo = await MensajeChatModel.create({
      alumno_id: Number(alumno_id),
      emisor_id: req.user.id,
      emisor_rol: rolEmisor,
      destinatario_rol: destinatario_rol || "TODOS",
      contenido,
      tipo_mensaje: tipo_mensaje || "CHAT",
      tarea_id: tarea_id || null,
    });

    const completo = await MensajeChatModel.findByPk(nuevo.id, {
      include: [
        { model: UserModel, as: "emisor", attributes: ["id", "nombre", "apellido"] },
        { model: AlumnoModel, as: "alumno", attributes: ["id", "nombre", "apellido"] },
      ],
    });

    return res.status(201).json({
      ok: true,
      mensaje: "Mensaje enviado en tiempo real",
      chat: completo,
    });
  } catch (error) {
    console.error("Error en createMensaje:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al enviar mensaje",
      error: error.message,
    });
  }
};
