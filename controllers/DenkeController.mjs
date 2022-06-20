import { Denke } from "../models/Denke.mjs";
import { User } from "../models/User.mjs";

export class DenkeController{
  static async showDenkes(req, res){
    res.render('denkes/home')
  }
}