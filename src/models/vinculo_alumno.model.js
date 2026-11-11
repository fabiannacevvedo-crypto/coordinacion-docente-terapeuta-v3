import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const VinculoAlumnoModel = sequelize.define(
  "VinculoAlumno",
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo_vinculo: {
      type: DataTypes.ENUM("DOCENTE_AULA", "TERAPEUTA_ACOMPANIANTE", "TUTOR_FAMILIAR"),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("ACTIVO", "INACTIVO"),
      defaultValue: "ACTIVO",
    },
  },
  {
    tableName: "vinculos_alumno",
    timestamps: true,
    underscored: true,
  }
);

export default VinculoAlumnoModel;
