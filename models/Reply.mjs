import { DataTypes } from "sequelize/types";
import { db } from "../db/conn.mjs";
import { User } from "./User.mjs";
import { Denke } from "./Denke.mjs";

export const Reply = db.define('Reply', {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true
  }
})

Reply.belongsTo(Denke);
Denke.hasMany(Reply);