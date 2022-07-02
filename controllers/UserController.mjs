import { Denke } from "../models/Denke.mjs";
import { User } from "../models/User.mjs";
import { Op } from "sequelize";

export default class UserController{
  static async showProfile(req, res){
    
    const userId = req.params.id ? req.params.id : req.session.userid;

    const userData = await User.findOne({
      where: {id: userId},
      plain: true
    })

    const user = userData.dataValues;

    let search = '';
    if (req.query.search){
      search = req.query.search
    }

    let order = 'DESC'

    if(req.query.order === 'old'){
      order = 'ASC';
    }

    const denkesData = await Denke.findAll({
      include: {all: true, nested: true},
      where: {
        UserId: userId,
        denkecontent: {[Op.like]: `%${search}%`}
      },
      order: [['updatedAt', order]]
    });

    let denkes = denkesData.map((result) => result.get({plain: true}))

    let thereIsNoDenke;
    if (denkes.length === 0){
      thereIsNoDenke = true;
    }

    // Check if denke is of current user
    denkes.forEach((denke) => {
      if (denke.User.id === req.session.userid){
        denke.fromCurrentUser = true;
      } else {
        denke.fromCurrentUser = false;
      }
    })

    //Check if denke is a reply to another one
    denkes.forEach(async(denke) => {
      if (denke.DenkeId){
        denke.isReply = true;
      } else {
        denke.isReply = false;
      }  
    })

    denkes.forEach((denke) => {
      if(denke.Denkes.length){
        denke.thereIsReplies = true;
      };
    })

    console.log(denkes)

    res.render('denkes/profile', {user, denkes, thereIsNoDenke})
  }
}