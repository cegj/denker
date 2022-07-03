import { DataTypes } from "sequelize";
import { db } from "../db/conn.mjs";
import { User } from "./User.mjs";

export const Follow = db.define('Follows')

Follow.belongsTo(User, {as: 'followed'})
Follow.belongsTo(User, {as: 'follower'})