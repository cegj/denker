import { Denke } from "../models/Denke.mjs";
import { Reply } from "../models/Reply.mjs";
import { Op } from "sequelize";
import { User } from "../models/User.mjs";

export default class ReplyController{
  static async saveReply(req, res){

    const reply = {
      replycontent: req.body.replyContent,
      DenkeId: +req.body.denkeId,
      UserId: req.session.userid,
    }

    console.log(reply)

    Reply.create(reply)
    .then(() => {
      req.session.save(() => {
        res.redirect(`/denkes/${req.body.denkeId}`)
      })
    })
    .catch((err) => console.log())

  }

  async getReplies(denkeId){
   
    const repliesData = await Reply.findAll({
      include: User,
      where: {
        denkeId: denkeId
      }
    })

    const replies = repliesData.map((result) => result.get({plain: true}))

    return replies;

  }
}