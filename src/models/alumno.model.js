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
      comment: "Diagnóstico profesional de TDAH y subtipo",
    },
    gravedad_tdah: {
      type: DataTypes.ENUM("LEVE", "MODERADO", "SEVERO"),
      defaultValue: "MODERADO",
      comment: "Nivel de apoyo clínico requerido según DSM-5 (Leve, Moderado, Severo)",
    },
    ficha_medica: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "JSON o detalle de ficha médica profesional (neurólogo/psiquiatra, medicación, ventana de foco, comorbilidades)",
    },
    sincronizador_matutino: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "JSON con las 3 pautas matutinas contestadas por el familiar antes de entrar al aula (descanso, disposición, preparación)",
    },
    agenda_diaria: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "JSON con la agenda diaria personalizada por Docente y Terapeuta según el sincronizador matutino y gravedad TDAH",
    },
    sala_grado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Sala de 5 Años - Nivel Inicial",
    },
    turno: {
      type: DataTypes.ENUM("MAÑANA", "TARDE", "JORNADA_COMPLETA"),
      defaultValue: "MAÑANA",
    },
    semaforo_actual: {
      type: DataTypes.ENUM("VERDE", "AMARILLO", "ROJO"),
      defaultValue: "VERDE",
      comment: "Estado sensorial/ejecutivo actual en el aula",
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
    paranoid: true,
    underscored: true,
  }
);

export default AlumnoModel;
