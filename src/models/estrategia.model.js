import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const EstrategiaModel = sequelize.define(
  "Estrategia",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    categoria: {
      type: DataTypes.ENUM("SENSORIAL", "CONDUCTUAL", "COMUNICACION", "PEDAGOGICA"),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pasos_guia: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icono: {
      type: DataTypes.STRING(50),
      defaultValue: "sparkles",
    },
    color_tag: {
      type: DataTypes.STRING(20),
      defaultValue: "#3b82f6",
    },
  },
  {
    tableName: "estrategias",
    timestamps: true,
    underscored: true,
  }
);

export default EstrategiaModel;
