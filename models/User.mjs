import { DataTypes, Sequelize } from "sequelize";
import { db } from "../db/conn.mjs";

export const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    require: true
  },
  username: {
    type: DataTypes.STRING,
    require: true
  },
  email: {
    type: DataTypes.STRING,
    require: true
  },
  hashedEmail: {
    type: DataTypes.STRING,
    require: true
  },
  password: {
    type: DataTypes.STRING,
    require: true
  }
})