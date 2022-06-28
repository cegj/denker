import { Denke } from "../models/Denke.mjs";
import { User } from "../models/User.mjs";

export default class DenkeController{
  static async showDenkes(req, res){
    res.render('denkes/home')
  }

  static async dashboard(req, res){
    
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

    res.render('denkes/dashboard', {denkes, thereIsNoDenke})
  }

  static createDenke(req, res){
    res.render('denkes/add')
  }

  
  static async createDenkeSave(req, res){
        
    const denke = {
      title: req.body.denke,
      userId: req.session.userid
    }

    try{
      await Denke.create(denke);

      req.flash('message', 'Denke criado!')
  
      req.session.save(() => {
        res.redirect('/denkes/dashboard')
      })  
    } catch(err) {
      console.log("OCORREU UM ERRO:" + err)
    }
  }

  static async removeDenke(req, res) {
    try {

      const id = req.body.id;
      const userId = req.session.userid;  

      await Denke.destroy({where:
      {id: id, UserId: userId}})
      
      req.flash('message', 'Denke removido!')
  
      req.session.save(() => {
        res.redirect('/denkes/dashboard')
      })
    } catch (err) {
      console.log("OCORREU UM ERRO:" + err)
    }
  }
}