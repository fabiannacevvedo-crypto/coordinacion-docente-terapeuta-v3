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
};
