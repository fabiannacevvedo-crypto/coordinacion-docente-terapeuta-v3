import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const DocentePerfilModel = sequelize.define(
  "DocentePerfil",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    institucion: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    cue_escuela: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    cargo: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    nivel_educativo: {
      type: DataTypes.STRING(50),
      defaultValue: "Nivel Inicial",
    },
    constancia_adjunta: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    verificado_institucional: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "docente_perfiles",
    timestamps: true,
    underscored: true,
  }
);

export default DocentePerfilModel;
