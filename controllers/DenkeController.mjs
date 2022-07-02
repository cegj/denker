import { Denke } from "../models/Denke.mjs";
import { User } from "../models/User.mjs";
import { Op } from "sequelize";

export default class DenkeController{

  static async showDenke(req, res){
    let id = req.params.id;
    
    const denkeData = await Denke.findOne({
      include: {all: true, nested: true},
      where: {id: id}
    })

    const denke = denkeData.get({plain: true})

    //Check if there is replies for denke
    if(denke.Denkes.length){
      denke.thereIsReplies = true;
    };


    //Get users of replies
    denke.Denkes.forEach(async(reply) => {
      let replyUser = await User.findOne({
        where: {id: reply.UserId}
      })
      
      replyUser = replyUser.get({plain: true})
      reply.User = replyUser;

      if (reply.User.id === req.session.userid){
        reply.fromCurrentUser = true;
      } else {
        reply.fromCurrentUser = false;
      }
    })

    //Get replies of replies
    // denke.Denkes.forEach(async(reply) => {
      // let replyReplies = await Denke.findAll({
        // include: Denke,
        // where: {id: reply.DenkeId},
        // raw: true,
        // plain: true
      // })
      // 
      // reply.Denkes = replyReplies;
// 
      // if (reply.Denkes.length){
        // reply.thereIsReplies = true;
      // }
    // })

    denke.Denkes.forEach(async(reply) => {
      if (reply.DenkeId){
        reply.isReply = true;
        const repliesDenke = await Denke.findAll({
          include: Denke,
          where: {DenkeId: reply.id},
        })

        reply.Denkes = repliesDenke;

        if(reply.Denkes.length){
          reply.thereIsReplies = true;
        }
      }
    })

    //Check if denke is a reply to another one
    if (denke.DenkeId){
      denke.isReply = true;
      const repliedDenke = await Denke.findOne({
        include: [User, Denke],
        where: {id: denke.DenkeId},
      })

      denke.repliedDenke = repliedDenke.get({plain: true})  
    } else {
      denke.isReply = false;
    }


    //Check if denke is from current user
    if (denke.User.id === req.session.userid){
      denke.fromCurrentUser = true;
    } else {
      denke.fromCurrentUser = false;
    }

    //Check if denke is a reply to another one
    if (denke.DenkeId){
      denke.isReply = true;
      const repliedDenke = await Denke.findOne({
        include: [User, Denke],
        where: {id: denke.DenkeId},
      })
      denke.repliedDenke = repliedDenke.get({plain: true})  
    } else {
      denke.isReply = false;
    }
    
    res.render('denkes/denke', {denke})

  }

  static async showDenkes(req, res){

    if(!req.session.userid){
      res.redirect('/login')
    }

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

    res.render('denkes/timeline', {denkes, thereIsNoDenke, search})
  }

  static async createDenkeSave(req, res){

    const replyTo = +req.body.replyTo || null;

    const denke = {
      denkecontent: req.body.denkecontent,
      UserId: req.session.userid,
      DenkeId: replyTo
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
    const userId = req.session.userid;
    const denkeId = req.params.id;
    let denke = await Denke.findOne({where: {id: denkeId}, raw: true})
    
    if(denke.UserId === userId){
      res.render('denkes/edit', {denke});
    } else {
      res.redirect('/')
    }
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
        res.redirect(`/denkes/${id}`)
      })
    })
    .catch((err) => console.log())

  }
}