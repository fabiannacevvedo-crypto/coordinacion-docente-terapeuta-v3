import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const TerapeutaPerfilModel = sequelize.define(
  "TerapeutaPerfil",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    especialidad: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: "Acompañante Terapéutico, Psicopedagogía, Psicología, Fonoaudiología, Terapia Ocupacional",
    },
    matricula_tipo: {
      type: DataTypes.STRING(10),
      defaultValue: "MN",
    },
    matricula_numero: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    colegio_profesional: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    jurisdiccion: {
      type: DataTypes.STRING(50),
      defaultValue: "Formosa",
    },
    credencial_adjunta: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    verificado_salud: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "terapeuta_perfiles",
    timestamps: true,
    underscored: true,
  }
);

export default TerapeutaPerfilModel;
