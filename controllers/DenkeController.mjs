import { Denke } from "../models/Denke.mjs";
import { User } from "../models/User.mjs";
import { Op } from "sequelize";
import ReplyController from "./ReplyController.mjs";

export default class DenkeController{

  static async showDenke(req, res){
    let id = req.params.id;
    
    const denkeData = await Denke.findOne({
      include: User,
      where: {id: id}
    })

    const denke = denkeData.get({plain: true})

    const replies = await ReplyController.prototype.getReplies(denke.id);

    console.log(replies)

    res.render('denkes/denke', {denke, replies})

  }

  static async showDenkes(req, res){

    let search = '';
    if (req.query.search){
      search = req.query.search
    }

    let order = 'DESC'

    if(req.query.order === 'old'){
      order = 'ASC';
    }

    const denkesData = await Denke.findAll({
      include: User,
      where: {
        denkecontent: {[Op.like]: `%${search}%`}
      },
      order: [['updatedAt', order]]
    });

    const denkes = denkesData.map((result) => result.get({plain: true}))

    let thereIsNoDenke;

    if (denkes.length === 0){
      thereIsNoDenke = true;
    }


    denkes.forEach((denke) => {
      if (denke.User.id === req.session.userid){
        denke.fromCurrentUser = true;
      } else {
        denke.fromCurrentUser = false;
      }
    })

    console.log(denkes)

    res.render('denkes/timeline', {denkes, thereIsNoDenke, search})
  }

  static createDenke(req, res){
    res.render('denkes/add')
  }

  static async createDenkeSave(req, res){

    console.log(req.headers.referer)

    const denke = {
      denkecontent: req.body.denkecontent,
      UserId: req.session.userid,
    }

    Denke.create(denke)
    .then(() => {
      req.session.save(() => {
        res.redirect(req.headers.referer)
      })
    })
    .catch((err) => console.log())
  }

  static async removeDenke(req, res) {
    try {

      const id = req.body.id;
      const userId = req.session.userid;  

      await Denke.destroy({where:
      {id: id, UserId: userId}})
      
      req.flash('message', 'Denke removido!')
  
      req.session.save(() => {
        res.redirect('/denkes/profile')
      })
    } catch (err) {
      console.log("OCORREU UM ERRO:" + err)
    }
  }

  static async editDenke(req, res){
    const id = req.params.id;
    let denke = await Denke.findOne({where: {id: id}, raw: true})    
    res.render('denkes/edit', {denke});
  }

  static async editDenkeSave(req, res){

    const id = req.body.id;

    const denke = {
      denkecontent: req.body.denkecontent
    }

    Denke.update(denke, {where: {id:id}})
    .then(() => {
      req.flash('message', 'Denke atualizado com sucesso!')
      req.session.save(() => {
        res.redirect('/denkes/profile')
      })
    })
    .catch((err) => console.log())

  }
}