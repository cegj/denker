import { Denke } from "../models/Denke.mjs";
import { User } from "../models/User.mjs";

export default class UserController{
  static async showProfile(req, res){
    
    const userId = req.params.id ? req.params.id : req.session.userid;

    const userData = await User.findOne({
      where: {id:userId},
      include: Denke,
      plain: true
    })


    if (!userData){
      res.redirect('/login')
    }

    const denkes = userData.Denkes.map((result) => result.dataValues)

    const user = userData.dataValues;

    let thereIsNoDenke;

    if (denkes.length === 0){
      thereIsNoDenke = true;
    }

    res.render('denkes/profile', {user, denkes, thereIsNoDenke})
  }
}