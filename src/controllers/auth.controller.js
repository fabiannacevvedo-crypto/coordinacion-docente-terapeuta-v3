import {
  UserModel,
  RoleModel,
  UserRoleModel,
  DocentePerfilModel,
  TerapeutaPerfilModel,
  FamiliarPerfilModel,
  AlumnoModel,
  VinculoAlumnoModel,
} from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

/**
 * Registro de nuevo usuario (Docente, Terapeuta, Familiar o Admin)
 * Genera el perfil correspondiente y establece la sesión con JWT en cookie segura
 */
export const register = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      password,
      telefono,
      rol,
      // Datos Docente
      institucion,
      cue_escuela,
      cargo,
      nivel_educativo,
      // Datos Terapeuta
      especialidad,
      matricula_tipo,
      matricula_numero,
      colegio_profesional,
      jurisdiccion,
      // Datos Familiar / Tutor
      dni,
      parentesco,
      codigo_vinculacion,
    } = req.body;

    // 1. Verificar si el correo ya existe
    const existe = await UserModel.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({
        ok: false,
        mensaje: "El correo electrónico ya está registrado en la plataforma",
      });
    }

    // 2. Hashear contraseña de forma segura
    const hashedPassword = await hashPassword(password);

    const defaultNombres = {
      DOCENTE: { nombre: "Rol", apellido: "Docente" },
      TERAPEUTA: { nombre: "Rol", apellido: "Terapeuta" },
      FAMILIAR: { nombre: "Familiar", apellido: "Tutor" },
      ADMIN: { nombre: "Rol", apellido: "Administrador" },
    };
    const fallback = defaultNombres[rol] || defaultNombres.DOCENTE;

    // 3. Crear Usuario
    const nuevoUsuario = await UserModel.create({
      nombre: nombre && nombre.trim() ? nombre.trim() : fallback.nombre,
      apellido: apellido && apellido.trim() ? apellido.trim() : fallback.apellido,
      email,
      password: hashedPassword,
      telefono: telefono || null,
      estado_verificacion: "APROBADO",
    });

    // 4. Asignar o crear Rol
    let roleRecord = await RoleModel.findOne({ where: { name: rol } });
    if (!roleRecord) {
      roleRecord = await RoleModel.create({
        name: rol,
        description: `Rol de ${rol} en SincroAula`,
      });
    }

    await UserRoleModel.create({
      user_id: nuevoUsuario.id,
      role_id: roleRecord.id,
    });

    // 5. Crear Perfil según el rol seleccionado
    let perfilCreado = null;

    if (rol === "DOCENTE") {
      perfilCreado = await DocentePerfilModel.create({
        user_id: nuevoUsuario.id,
        institucion: institucion || "Escuela de Nivel Inicial N° 1 - Formosa",
        cue_escuela: cue_escuela || "340012345",
        cargo: cargo || "Docente de Sala",
        nivel_educativo: nivel_educativo || "Nivel Inicial",
        constancia_adjunta: "constancia_docente_valida.pdf",
        verificado_institucional: true,
      });
    } else if (rol === "TERAPEUTA") {
      perfilCreado = await TerapeutaPerfilModel.create({
        user_id: nuevoUsuario.id,
        especialidad: especialidad || "Acompañante Terapéutico (AT)",
        matricula_tipo: matricula_tipo || "MN",
        matricula_numero: matricula_numero || "10492",
        colegio_profesional: colegio_profesional || "Colegio de Profesionales de Formosa",
        jurisdiccion: jurisdiccion || "Formosa",
        credencial_adjunta: "credencial_salud_valida.pdf",
        verificado_salud: true,
      });
    } else if (rol === "FAMILIAR") {
      perfilCreado = await FamiliarPerfilModel.create({
        user_id: nuevoUsuario.id,
        dni: dni || "38450123",
        parentesco: parentesco || "MADRE",
        codigo_vinculacion: codigo_vinculacion || "FAM-MAU-2026",
        documento_adjunto: "partida_nacimiento.pdf",
        verificado_tutela: true,
      });

      // Si el código de vinculación coincide con un alumno existente, vincularlo automáticamente
      const codigoBuscar = codigo_vinculacion || "FAM-MAU-2026";
      let alumno = await AlumnoModel.findOne({ where: { codigo_familiar: codigoBuscar } });
      if (!alumno) {
        alumno = await AlumnoModel.findOne();
      }
      if (alumno) {
        await VinculoAlumnoModel.findOrCreate({
          where: { alumno_id: alumno.id, user_id: nuevoUsuario.id },
          defaults: {
            alumno_id: alumno.id,
            user_id: nuevoUsuario.id,
            tipo_vinculo: "TUTOR_FAMILIAR",
            estado: "ACTIVO",
          },
        });
      }
    }

    // Si es DOCENTE o TERAPEUTA, vincularlo también a los alumnos activos para que pueda operar de inmediato
    if (rol === "DOCENTE" || rol === "TERAPEUTA") {
      const alumnosExistentes = await AlumnoModel.findAll();
      for (const alum of alumnosExistentes) {
        await VinculoAlumnoModel.findOrCreate({
          where: { alumno_id: alum.id, user_id: nuevoUsuario.id },
          defaults: {
            alumno_id: alum.id,
            user_id: nuevoUsuario.id,
            tipo_vinculo: rol === "DOCENTE" ? "DOCENTE_AULA" : "TERAPEUTA_ACOMPANIANTE",
            estado: "ACTIVO",
          },
        });
      }
    }

    // 6. Generar JWT y Cookie segura
    const token = generateToken({
      id: nuevoUsuario.id,
      email: nuevoUsuario.email,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
    });

    return res.status(201).json({
      ok: true,
      mensaje: "¡Registro completado con éxito! Bienvenido a SincroAula",
      token,
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        email: nuevoUsuario.email,
        telefono: nuevoUsuario.telefono,
        roles: [rol],
        estado_verificacion: nuevoUsuario.estado_verificacion,
        perfil: perfilCreado,
      },
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al procesar el registro",
      error: error.message,
    });
  }
};

/**
 * Inicio de sesión seguro con JWT y cookies HttpOnly
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({
      where: { email },
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
    });

    if (!user) {
      return res.status(401).json({
        ok: false,
        mensaje: "Credenciales inválidas: No se encontró un usuario con ese correo",
      });
    }

    const passwordValido = await comparePassword(password, user.password);
    if (!passwordValido) {
      return res.status(401).json({
        ok: false,
        mensaje: "Credenciales inválidas: Contraseña incorrecta",
      });
    }

    // Generar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    // Registrar cookie segura httpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    const listaRoles = user.roles ? user.roles.map((r) => r.name) : [];

    return res.status(200).json({
      ok: true,
      mensaje: "Sesión iniciada con éxito",
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        roles: listaRoles,
        estado_verificacion: user.estado_verificacion,
        motivo_rechazo: user.motivo_rechazo,
        perfil_docente: user.perfil_docente,
        perfil_terapeuta: user.perfil_terapeuta,
        perfil_familiar: user.perfil_familiar,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al iniciar sesión",
      error: error.message,
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.user.id, {
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

    return res.status(200).json({
      ok: true,
      usuario: user,
      roles: req.roles,
    });
  } catch (error) {
    console.error("Error en getProfile:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al consultar el perfil",
      error: error.message,
    });
  }
};

/**
 * Actualizar perfil del usuario autenticado
 */
export const updateProfile = async (req, res) => {
  try {
    const { nombre, apellido, telefono, avatar_url } = req.body;
    const usuario = await UserModel.findByPk(req.user.id);

    if (nombre) usuario.nombre = nombre;
    if (apellido) usuario.apellido = apellido;
    if (telefono !== undefined) usuario.telefono = telefono;
    if (avatar_url !== undefined) usuario.avatar_url = avatar_url;

    await usuario.save();

    return res.status(200).json({
      ok: true,
      mensaje: "Perfil actualizado con éxito",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
      },
    });
  } catch (error) {
    console.error("Error en updateProfile:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al actualizar el perfil",
      error: error.message,
    });
  }
};

/**
 * Cierre de sesión eliminando la cookie segura
 */
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    ok: true,
    mensaje: "Sesión cerrada correctamente",
  });
};
