import { DataTypes } from "sequelize";
import { db } from "../db/conn.mjs";
import { User } from "./User.mjs";

export const Follow = db.define('Follows', {
  idUserFollowed: {
    type: DataTypes.STRING,
    require: true
  }
})

Follow.belongsTo(User)
User.hasMany(Follow)