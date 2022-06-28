import { DataTypes } from "sequelize";
import { db } from "../db/conn.mjs";
import { User } from "./User.mjs";

//NEED TO IMPORT USER

export const Denke = db.define('Denke', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true
  }
})

Denke.belongsTo(User);
User.hasMany(Denke);