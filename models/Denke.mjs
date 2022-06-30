import { DataTypes } from "sequelize";
import { db } from "../db/conn.mjs";
import { User } from "./User.mjs";

export const Denke = db.define('Denke', {
  denkecontent: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true
  }
})

Denke.belongsTo(User);
User.hasMany(Denke);