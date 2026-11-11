import { matchedData } from "express-validator";
import {
  UserModel,
  RoleModel,
  UserRoleModel,
  DocentePerfilModel,
  TerapeutaPerfilModel,
  FamiliarPerfilModel,
  AlumnoModel,
} from "../models/index.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";

/**
 * Obtener listado de usuarios con roles y perfiles
 * Soporta búsqueda por nombre/email y filtrado por estado de verificación
 */
export const getAllUsers = async (req, res) => {
  try {
    const { busqueda, estado } = req.query;
    const where = {};

    if (estado) {
      where.estado_verificacion = estado;
    }

    const usuarios = await UserModel.findAll({
      where,
      attributes: { exclude: ["password"] },
      include: [
        {
          model: RoleModel,
          as: "roles",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
        { model: DocentePerfilModel, as: "perfil_docente" },
        { model: TerapeutaPerfilModel, as: "perfil_terapeuta" },
        { model: FamiliarPerfilModel, as: "perfil_familiar" },
      ],
      order: [["created_at", "DESC"]],
    });

    let resultado = usuarios;
    if (busqueda) {
      const q = busqueda.toLowerCase();
      resultado = usuarios.filter(
        (u) =>
          u.nombre.toLowerCase().includes(q) ||
          u.apellido.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      ok: true,
      total: resultado.length,
      usuarios: resultado,
    });
  } catch (error) {
    console.error("Error en getAllUsers:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener el listado de usuarios",
      error: error.message,
    });
  }
};

/**
 * Obtener un usuario específico por ID con su perfil y alumnos asociados
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await UserModel.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: RoleModel,
          as: "roles",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
        { model: DocentePerfilModel, as: "perfil_docente" },
        { model: TerapeutaPerfilModel, as: "perfil_terapeuta" },
        { model: FamiliarPerfilModel, as: "perfil_familiar" },
        {
          model: AlumnoModel,
          as: "alumnos_asignados",
          through: { attributes: ["tipo_vinculo", "estado"] },
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: `Usuario con ID ${id} no encontrado`,
      });
    }

    return res.status(200).json({
      ok: true,
      usuario,
    });
  } catch (error) {
    console.error("Error en getUserById:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener el usuario",
      error: error.message,
    });
  }
};

/**
 * Crear un usuario administrativamente
 */
export const createUser = async (req, res) => {
  try {
    const data = matchedData(req);

    const existe = await UserModel.findOne({ where: { email: data.email } });
    if (existe) {
      return res.status(400).json({
        ok: false,
        mensaje: "El correo electrónico ya se encuentra registrado",
      });
    }

    const hashedPassword = await hashPassword(data.password);
    const nuevoUsuario = await UserModel.create({
      ...data,
      password: hashedPassword,
      estado_verificacion: "APROBADO",
    });

    if (data.rol) {
      const rolEncontrado = await RoleModel.findOne({ where: { name: data.rol } });
      if (rolEncontrado) {
        await UserRoleModel.create({
          user_id: nuevoUsuario.id,
          role_id: rolEncontrado.id,
        });
      }
    }

    const userClean = nuevoUsuario.toJSON();
    delete userClean.password;

    return res.status(201).json({
      ok: true,
      mensaje: "Usuario creado con éxito",
      usuario: userClean,
    });
  } catch (error) {
    console.error("Error en createUser:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al crear usuario",
      error: error.message,
    });
  }
};

/**
 * Actualizar usuario por ID
 * Utiliza matchedData(req) para asegurar que solo se actualicen datos validados
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const datosValidados = matchedData(req);

    const usuario = await UserModel.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: `Usuario con ID ${id} no encontrado`,
      });
    }

    if (datosValidados.password) {
      datosValidados.password = await hashPassword(datosValidados.password);
    }

    await usuario.update(datosValidados);

    const usuarioActualizado = await UserModel.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [{ model: RoleModel, as: "roles", through: { attributes: [] } }],
    });

    return res.status(200).json({
      ok: true,
      mensaje: "Usuario actualizado exitosamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error en updateUser:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al actualizar usuario",
      error: error.message,
    });
  }
};

/**
 * Eliminación lógica (Soft Delete) del usuario
 * Al tener paranoid: true, .destroy() setea deleted_at sin borrar físicamente
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await UserModel.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: `Usuario con ID ${id} no encontrado`,
      });
    }

    // Ejecuta eliminación lógica mediante Sequelize paranoid
    await usuario.destroy();

    return res.status(200).json({
      ok: true,
      mensaje: `Usuario con ID ${id} eliminado lógicamente con éxito. Los registros históricos se preservan.`,
    });
  } catch (error) {
    console.error("Error en deleteUser:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al eliminar usuario",
      error: error.message,
    });
  }
};

/**
 * Restaurar usuario eliminado lógicamente
 */
export const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await UserModel.findByPk(id, { paranoid: false });
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: `Usuario con ID ${id} no encontrado`,
      });
    }

    await usuario.restore();

    return res.status(200).json({
      ok: true,
      mensaje: `Usuario con ID ${id} restaurado exitosamente`,
      usuario,
    });
  } catch (error) {
    console.error("Error en restoreUser:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al restaurar usuario",
      error: error.message,
    });
  }
};
