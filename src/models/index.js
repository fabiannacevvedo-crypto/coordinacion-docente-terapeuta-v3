import { sequelize } from "../config/database.js";
import { UserModel } from "./user.model.js";
import { RoleModel } from "./role.model.js";
import { UserRoleModel } from "./user_role.model.js";
import { DocentePerfilModel } from "./docente_perfil.model.js";
import { TerapeutaPerfilModel } from "./terapeuta_perfil.model.js";
import { FamiliarPerfilModel } from "./familiar_perfil.model.js";
import { AlumnoModel } from "./alumno.model.js";
import { VinculoAlumnoModel } from "./vinculo_alumno.model.js";
import { ReporteModel } from "./reporte.model.js";
import { EstrategiaModel } from "./estrategia.model.js";
import { AlumnoEstrategiaModel } from "./alumno_estrategia.model.js";
import { AlertaCoordinacionModel } from "./alerta_coordinacion.model.js";
import { TareaModel } from "./tarea.model.js";
import { MensajeChatModel } from "./mensaje_chat.model.js";
import { PresentacionAdaptadaModel } from "./presentacion_adaptada.model.js";

// ==========================================
// ASOCIACIONES 1:1 - USUARIO CON SUS PERFILES
// ==========================================
UserModel.hasOne(DocentePerfilModel, {
  foreignKey: "user_id",
  as: "perfil_docente",
  onDelete: "CASCADE",
});
DocentePerfilModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "usuario",
});

UserModel.hasOne(TerapeutaPerfilModel, {
  foreignKey: "user_id",
  as: "perfil_terapeuta",
  onDelete: "CASCADE",
});
TerapeutaPerfilModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "usuario",
});

UserModel.hasOne(FamiliarPerfilModel, {
  foreignKey: "user_id",
  as: "perfil_familiar",
  onDelete: "CASCADE",
});
FamiliarPerfilModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "usuario",
});

// ==========================================
// ASOCIACIONES N:M - USUARIOS Y ROLES (RBAC)
// ==========================================
UserModel.belongsToMany(RoleModel, {
  through: UserRoleModel,
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "roles",
});
RoleModel.belongsToMany(UserModel, {
  through: UserRoleModel,
  foreignKey: "role_id",
  otherKey: "user_id",
  as: "usuarios",
});

// ==========================================
// ASOCIACIONES N:M - VINCULO ALUMNO CON EQUIPO INTERDISCIPLINARIO
// ==========================================
UserModel.belongsToMany(AlumnoModel, {
  through: VinculoAlumnoModel,
  foreignKey: "user_id",
  otherKey: "alumno_id",
  as: "alumnos_asignados",
});
AlumnoModel.belongsToMany(UserModel, {
  through: VinculoAlumnoModel,
  foreignKey: "alumno_id",
  otherKey: "user_id",
  as: "equipo_interdisciplinario",
});

// Acceso directo a vínculos
AlumnoModel.hasMany(VinculoAlumnoModel, { foreignKey: "alumno_id", as: "vinculos" });
VinculoAlumnoModel.belongsTo(AlumnoModel, { foreignKey: "alumno_id", as: "alumno" });
UserModel.hasMany(VinculoAlumnoModel, { foreignKey: "user_id", as: "vinculos" });
VinculoAlumnoModel.belongsTo(UserModel, { foreignKey: "user_id", as: "usuario" });

// ==========================================
// ASOCIACIONES 1:N - REPORTES Y BITÁCORA DIARIA
// ==========================================
UserModel.hasMany(ReporteModel, {
  foreignKey: "autor_id",
  as: "reportes_creados",
  onDelete: "CASCADE",
});
ReporteModel.belongsTo(UserModel, {
  foreignKey: "autor_id",
  as: "autor",
});

AlumnoModel.hasMany(ReporteModel, {
  foreignKey: "alumno_id",
  as: "reportes",
  onDelete: "CASCADE",
});
ReporteModel.belongsTo(AlumnoModel, {
  foreignKey: "alumno_id",
  as: "alumno",
});

// ==========================================
// ASOCIACIONES N:M - ALUMNOS Y ESTRATEGIAS RECOMENDADAS
// ==========================================
AlumnoModel.belongsToMany(EstrategiaModel, {
  through: AlumnoEstrategiaModel,
  foreignKey: "alumno_id",
  otherKey: "estrategia_id",
  as: "estrategias",
});
EstrategiaModel.belongsToMany(AlumnoModel, {
  through: AlumnoEstrategiaModel,
  foreignKey: "estrategia_id",
  otherKey: "alumno_id",
  as: "alumnos",
});

// ==========================================
// ASOCIACIONES 1:N - ALERTAS DE COORDINACIÓN EN EL AULA
// ==========================================
AlumnoModel.hasMany(AlertaCoordinacionModel, {
  foreignKey: "alumno_id",
  as: "alertas",
  onDelete: "CASCADE",
});
AlertaCoordinacionModel.belongsTo(AlumnoModel, {
  foreignKey: "alumno_id",
  as: "alumno",
});

UserModel.hasMany(AlertaCoordinacionModel, {
  foreignKey: "emisor_id",
  as: "alertas_emitidas",
});
AlertaCoordinacionModel.belongsTo(UserModel, {
  foreignKey: "emisor_id",
  as: "emisor",
});

// ==========================================
// ASOCIACIONES 1:N - TAREAS CON FLUJO DE ADAPTACIÓN TDAH (DOCENTE -> TERAPEUTA -> TUTOR)
// ==========================================
AlumnoModel.hasMany(TareaModel, {
  foreignKey: "alumno_id",
  as: "tareas",
  onDelete: "CASCADE",
});
TareaModel.belongsTo(AlumnoModel, {
  foreignKey: "alumno_id",
  as: "alumno",
});

UserModel.hasMany(TareaModel, {
  foreignKey: "docente_id",
  as: "tareas_creadas",
});
TareaModel.belongsTo(UserModel, {
  foreignKey: "docente_id",
  as: "docente",
});

UserModel.hasMany(TareaModel, {
  foreignKey: "terapeuta_id",
  as: "tareas_adaptadas",
});
TareaModel.belongsTo(UserModel, {
  foreignKey: "terapeuta_id",
  as: "terapeuta",
});

// ==========================================
// ASOCIACIONES 1:N - CHAT MULTICANAL EN TIEMPO REAL
// ==========================================
AlumnoModel.hasMany(MensajeChatModel, {
  foreignKey: "alumno_id",
  as: "mensajes_chat",
  onDelete: "CASCADE",
});
MensajeChatModel.belongsTo(AlumnoModel, {
  foreignKey: "alumno_id",
  as: "alumno",
});

UserModel.hasMany(MensajeChatModel, {
  foreignKey: "emisor_id",
  as: "mensajes_enviados",
});
MensajeChatModel.belongsTo(UserModel, {
  foreignKey: "emisor_id",
  as: "emisor",
});

// ==========================================
// ASOCIACIONES 1:N - PRESENTACIONES ADAPTADAS PARA EL ALUMNO (CREADOR DOCENTE)
// ==========================================
AlumnoModel.hasMany(PresentacionAdaptadaModel, {
  foreignKey: "alumno_id",
  as: "presentaciones",
  onDelete: "SET NULL",
});
PresentacionAdaptadaModel.belongsTo(AlumnoModel, {
  foreignKey: "alumno_id",
  as: "alumno",
});

UserModel.hasMany(PresentacionAdaptadaModel, {
  foreignKey: "docente_id",
  as: "presentaciones_creadas",
});
PresentacionAdaptadaModel.belongsTo(UserModel, {
  foreignKey: "docente_id",
  as: "docente",
});

export {
  sequelize,
  UserModel,
  RoleModel,
  UserRoleModel,
  DocentePerfilModel,
  TerapeutaPerfilModel,
  FamiliarPerfilModel,
  AlumnoModel,
  VinculoAlumnoModel,
  ReporteModel,
  EstrategiaModel,
  AlumnoEstrategiaModel,
  AlertaCoordinacionModel,
  TareaModel,
  MensajeChatModel,
  PresentacionAdaptadaModel,
};

export default {
  sequelize,
  UserModel,
  RoleModel,
  UserRoleModel,
  DocentePerfilModel,
  TerapeutaPerfilModel,
  FamiliarPerfilModel,
  AlumnoModel,
  VinculoAlumnoModel,
  ReporteModel,
  EstrategiaModel,
  AlumnoEstrategiaModel,
  AlertaCoordinacionModel,
  TareaModel,
  MensajeChatModel,
  PresentacionAdaptadaModel,
};
