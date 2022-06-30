import { Denke } from "../models/Denke.mjs";
import { Reply } from "../models/Reply.mjs";
import { Op } from "sequelize";

export default class ReplyController{
  static async SaveReply(req, res){
    const reply = {
      title: req.body.replyContent,
      denkeId: req.body.denkeId,
      UserId: req.session.userid,
    }

    Reply.create(reply)
    .then(() => {
      req.session.save(() => {
        res.redirect(`/denkes/${denkeId}`)
      })
    })
    .catch((err) => console.log())

  }
}