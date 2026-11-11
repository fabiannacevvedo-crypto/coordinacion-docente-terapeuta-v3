import { matchedData } from "express-validator";
import { AlertaCoordinacionModel, UserModel, AlumnoModel } from "../models/index.js";

/**
 * Listar alertas del aula (especialmente alertas activas/pendientes)
 */
export const getAlertas = async (req, res) => {
  try {
    const { alumno_id, estado } = req.query;
    const where = {};

    if (alumno_id) where.alumno_id = alumno_id;
    if (estado) where.estado = estado;

    const alertas = await AlertaCoordinacionModel.findAll({
      where,
      include: [
        {
          model: UserModel,
          as: "emisor",
          attributes: ["id", "nombre", "apellido"],
        },
        {
          model: AlumnoModel,
          as: "alumno",
          attributes: ["id", "nombre", "apellido", "sala_grado"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 30,
    });

    return res.status(200).json({
      ok: true,
      total: alertas.length,
      alertas,
    });
  } catch (error) {
    console.error("Error en getAlertas:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener las alertas de coordinación",
      error: error.message,
    });
  }
};

/**
 * Emitir una nueva alerta rápida de coordinación (ej. Docente avisa al Terapeuta)
 */
export const createAlerta = async (req, res) => {
  try {
    const data = matchedData(req);

    const nuevaAlerta = await AlertaCoordinacionModel.create({
      ...data,
      emisor_id: req.user.id,
      estado: "PENDIENTE",
    });

    const alertaCompleta = await AlertaCoordinacionModel.findByPk(nuevaAlerta.id, {
      include: [
        { model: UserModel, as: "emisor", attributes: ["id", "nombre", "apellido"] },
        { model: AlumnoModel, as: "alumno", attributes: ["id", "nombre", "apellido"] },
      ],
    });

    return res.status(201).json({
      ok: true,
      mensaje: "Alerta emitida con éxito al equipo interdisciplinario",
      alerta: alertaCompleta,
    });
  } catch (error) {
    console.error("Error en createAlerta:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al emitir la alerta",
      error: error.message,
    });
  }
};

/**
 * Marcar alerta como atendida
 */
export const atenderAlerta = async (req, res) => {
  try {
    const { id } = req.params;

    const alerta = await AlertaCoordinacionModel.findByPk(id);
    if (!alerta) {
      return res.status(404).json({
        ok: false,
        mensaje: `Alerta con ID ${id} no encontrada`,
      });
    }

    await alerta.update({
      estado: "ATENDIDA",
      atendida_por: req.user.id,
    });

    return res.status(200).json({
      ok: true,
      mensaje: "Alerta marcada como atendida",
      alerta,
    });
  } catch (error) {
    console.error("Error en atenderAlerta:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al atender la alerta",
      error: error.message,
    });
  }
};
