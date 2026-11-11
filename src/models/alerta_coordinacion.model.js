import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const AlertaCoordinacionModel = sequelize.define(
  "AlertaCoordinacion",
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
    receptor_rol: {
      type: DataTypes.STRING(30),
      defaultValue: "TERAPEUTA",
      comment: "TERAPEUTA, DOCENTE, TODOS",
    },
    tipo_alerta: {
      type: DataTypes.ENUM("DESREGULACION", "SOBRECARGA_SENSORIAL", "CAMBIO_ACTIVIDAD", "LOGRO_DESTACADO", "CONSULTA_URGENTE"),
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nivel_urgencia: {
      type: DataTypes.ENUM("ALTA", "MEDIA", "INFORMATIVA"),
      defaultValue: "MEDIA",
    },
    estado: {
      type: DataTypes.ENUM("PENDIENTE", "ATENDIDA"),
      defaultValue: "PENDIENTE",
    },
    atendida_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "alertas_coordinacion",
    timestamps: true,
    underscored: true,
  }
);

export default AlertaCoordinacionModel;
