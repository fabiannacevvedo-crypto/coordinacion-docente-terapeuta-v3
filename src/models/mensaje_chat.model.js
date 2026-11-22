import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const MensajeChatModel = sequelize.define(
  "MensajeChat",
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
    emisor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    emisor_rol: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "DOCENTE",
    },
    destinatario_rol: {
      type: DataTypes.ENUM("TODOS", "DOCENTE", "TERAPEUTA", "FAMILIAR"),
      defaultValue: "TODOS",
      comment: "Permite enviar mensaje a un rol puntual (Docente, Terapeuta o Tutor) o a todo el equipo",
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipo_mensaje: {
      type: DataTypes.ENUM("CHAT", "REPORTE_TAREA", "PAUTA_TERAPEUTICA", "AVISO_FAMILIA"),
      defaultValue: "CHAT",
    },
    tarea_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "mensajes_chat",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default MensajeChatModel;
