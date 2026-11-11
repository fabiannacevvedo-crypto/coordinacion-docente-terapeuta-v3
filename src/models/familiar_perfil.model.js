import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const FamiliarPerfilModel = sequelize.define(
  "FamiliarPerfil",
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
    dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    parentesco: {
      type: DataTypes.ENUM("MADRE", "PADRE", "TUTOR_LEGAL", "FAMILIAR"),
      defaultValue: "MADRE",
      allowNull: false,
    },
    codigo_vinculacion: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    documento_adjunto: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    verificado_tutela: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "familiar_perfiles",
    timestamps: true,
    underscored: true,
  }
);

export default FamiliarPerfilModel;
