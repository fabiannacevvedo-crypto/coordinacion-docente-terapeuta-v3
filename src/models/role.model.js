import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const RoleModel = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: "ADMIN, DOCENTE, TERAPEUTA, FAMILIAR",
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "roles",
    timestamps: true,
    underscored: true,
  }
);

export default RoleModel;
