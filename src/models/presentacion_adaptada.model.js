import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const PresentacionAdaptadaModel = sequelize.define(
  "PresentacionAdaptada",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    objetivo_pedagogico: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    alumno_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Null si es para toda la sala o ID del alumno específico",
    },
    docente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    perfil_sensorial_tdah: {
      type: DataTypes.STRING(100),
      defaultValue: "Bajo Estímulo Visual + Consigna Única (TDAH)",
    },
    diapositivas_json: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "JSON string con las diapositivas adaptadas (título, instrucción corta, apoyo visual, tiempo sugerido)",
    },
    compartida_con_familia: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "presentaciones_adaptadas",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default PresentacionAdaptadaModel;
