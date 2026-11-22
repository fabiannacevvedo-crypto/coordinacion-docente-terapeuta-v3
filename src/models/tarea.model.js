import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const TareaModel = sequelize.define(
  "Tarea",
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
    consigna_original: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Consigna pedagógica redactada originalmente por el docente",
    },
    tipo_asignacion: {
      type: DataTypes.ENUM("INDIVIDUAL", "CONJUNTO"),
      defaultValue: "INDIVIDUAL",
      comment: "Si la tarea fue asignada a un alumno en particular o en conjunto a la sala",
    },
    alumno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    docente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    terapeuta_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Terapeuta o AT que realizó la adaptación para TDAH",
    },
    subtipo_tdah_objetivo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "TDAH Combinado (Inatención + Hiperactividad/Impulsividad)",
    },
    pautas_tdah_aplicadas: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Pautas clínicas y neuroeducativas seleccionadas por el terapeuta (ej. Micro-segmentación, Pomodoro, Apoyo Visual)",
    },
    adaptacion_terapeuta: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Consigna adaptada paso a paso por el terapeuta para el alumno con TDAH",
    },
    recursos_apoyo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Pictogramas, temporizador visual o material concreto sugerido",
    },
    estado: {
      type: DataTypes.ENUM(
        "PENDIENTE_TERAPEUTA",
        "ADAPTADA_ENVIADA_TUTOR",
        "COMPLETADA_POR_TUTOR"
      ),
      defaultValue: "PENDIENTE_TERAPEUTA",
    },
    reporte_tutor: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Devolución del padre/tutor sobre cómo estuvo su hijo en la actividad",
    },
    nivel_atencion_hogar: {
      type: DataTypes.ENUM("ALTO_ENFOQUE", "ENFOQUE_MODERADO", "REQUIRIO_PAUSAS", "DIFICULTAD_ALTA"),
      allowNull: true,
    },
    destinatario_reporte_tutor: {
      type: DataTypes.ENUM("AMBOS", "DOCENTE", "TERAPEUTA"),
      allowNull: true,
      defaultValue: "AMBOS",
    },
    fecha_entrega: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
  },
  {
    tableName: "tareas_adaptadas",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default TareaModel;
