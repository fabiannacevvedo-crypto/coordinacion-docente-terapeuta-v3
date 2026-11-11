import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const AlumnoEstrategiaModel = sequelize.define(
  "AlumnoEstrategia",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    alumno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estrategia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    efectividad: {
      type: DataTypes.ENUM("ALTA", "MEDIA", "EN_EVALUACION"),
      defaultValue: "EN_EVALUACION",
    },
    notas: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "alumno_estrategias",
    timestamps: true,
    underscored: true,
  }
);

export default AlumnoEstrategiaModel;
