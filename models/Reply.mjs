import { DataTypes } from "sequelize";
import { db } from "../db/conn.mjs";
import { Denke } from "./Denke.mjs";
import { User } from "./User.mjs";

export const Reply = db.define('Reply', {
  replycontent: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true
  }
})

Reply.belongsTo(Denke);
Denke.hasMany(Reply);
Reply.belongsTo(User);
User.hasMany(Reply);