import { Denke } from "../models/Denke.mjs";
import { User } from "../models/User.mjs";
import { Op } from "sequelize";

export default class DenkeController{
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
        title: {[Op.like]: `%${search}%`}
      },
      order: [['updatedAt', order]]
    });

    const denkes = denkesData.map((result) => result.get({plain: true}))

    console.log(denkes)

    let thereIsNoDenke;

    if (denkes.length === 0){
      thereIsNoDenke = true;
    }

    res.render('denkes/timeline', {denkes, thereIsNoDenke, search})
  }

  static async profile(req, res){
    
    const userId = req.session.userid

    const user = await User.findOne({
      where: {id:userId},
      include: Denke,
      plain: true
    })

    if (!user){
      res.redirect('/login')
    }

    const denkes = user.Denkes.map((result) => result.dataValues)

    let thereIsNoDenke;

    if (denkes.length === 0){
      thereIsNoDenke = true;
    }

    res.render('denkes/profile', {denkes, thereIsNoDenke})
  }

  static createDenke(req, res){
    res.render('denkes/add')
  }

  static async createDenkeSave(req, res){

    const denke = {
      title: req.body.title,
      UserId: req.session.userid,
    }

    console.log(denke)

    Denke.create(denke)
    .then(() => {
      req.flash('message', 'Pensamento criado com sucesso!')
      req.session.save(() => {
        res.redirect('/denkes/profile')
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
    console.log(denke)
    res.render('denkes/edit', {denke});
  }

  static async editDenkeSave(req, res){

    const id = req.body.id;

    const denke = {
      title: req.body.title
    }

    Denke.update(denke, {where: {id:id}})
    .then(() => {
      req.flash('message', 'Pensamento atualizado com sucesso!')
      req.session.save(() => {
        res.redirect('/denkes/profile')
      })
    })
    .catch((err) => console.log())

  }
}