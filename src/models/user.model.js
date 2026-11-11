import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const UserModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    estado_verificacion: {
      type: DataTypes.ENUM("PENDIENTE", "APROBADO", "RECHAZADO"),
      defaultValue: "PENDIENTE",
      allowNull: false,
    },
    motivo_rechazo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ultimo_acceso: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    paranoid: true, // Eliminación lógica (soft delete) obligatoria según especificaciones IPF
    underscored: true,
  }
);

export default UserModel;
