import { Follow } from "../models/Follow.mjs";
import { User } from "../models/User.mjs";

export default class FollowController{

  static async CheckIsFollowing(req, res, idUserFollowed){

    const userId = req.session.userid

    const userData = await Follow.findOne({
      where: {
        idUserFollowed: idUserFollowed, 
        UserId: userId
      },
      plain: true
    })

    console.log(userData)
    return userData;
  }

   static async followUnfollow(req, res){
    console.log(req.params)
    const userId = req.session.userid;
    const userToFollow = req.params.userToFollow;

    const isFollowing = await FollowController.CheckIsFollowing(req, res, userToFollow);
    
    if (isFollowing){
      console.log("JÁ SEGUE")
      res.redirect(req.headers.referrer);
      return;
    }
    
    console.log("NÃO SEGUE")

    const follow = {
      idUserFollowed: userToFollow,
      UserId: userId
    }

    Follow.create(follow)
    .then(() => {
      req.session.save(() => {
        res.redirect(req.headers.referer)
      })
    })
    }
  }