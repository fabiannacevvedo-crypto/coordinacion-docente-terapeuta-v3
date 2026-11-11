import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const AlumnoModel = sequelize.define(
  "Alumno",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    diagnostico: {
      type: DataTypes.STRING(150),
      allowNull: true,
      comment: "TEA, TDAH, Trastorno de la comunicación, Necesidad de acompañamiento pedagógico",
    },
    sala_grado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Sala de 4 Años - Nivel Inicial",
    },
    turno: {
      type: DataTypes.ENUM("MAÑANA", "TARDE", "JORNADA_COMPLETA"),
      defaultValue: "MAÑANA",
    },
    semaforo_actual: {
      type: DataTypes.ENUM("VERDE", "AMARILLO", "ROJO"),
      defaultValue: "VERDE",
      comment: "Estado sensorial/emocional actual en el aula",
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    foto_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    codigo_familiar: {
      type: DataTypes.STRING(30),
      allowNull: true,
      unique: true,
      comment: "Código para vincular al tutor o familiar",
    },
  },
  {
    tableName: "alumnos",
    timestamps: true,
    paranoid: true, // Eliminación lógica
    underscored: true,
  }
);

export default AlumnoModel;
