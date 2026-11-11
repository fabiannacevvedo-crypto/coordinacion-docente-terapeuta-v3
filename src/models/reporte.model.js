import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const ReporteModel = sequelize.define(
  "Reporte",
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
    autor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    semaforo_emocional: {
      type: DataTypes.ENUM("VERDE", "AMARILLO", "ROJO"),
      allowNull: false,
      defaultValue: "VERDE",
      comment: "VERDE: Calmo/Participativo, AMARILLO: Inquieto/Alerta, ROJO: Desregulación/Contención",
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    estrategia_utilizada: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    respuesta_alumno: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    compartido_con_familia: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "reportes",
    timestamps: true,
    paranoid: true, // Eliminación lógica
    underscored: true,
  }
);

export default ReporteModel;
