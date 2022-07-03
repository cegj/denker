import { Follow } from "../models/Follow.mjs";
import { User } from "../models/User.mjs";

export default class FollowController{

  async getFollows(userId){

    const user = userId || req.session.userid;

    let data = {};

    try {
      let following = await Follow.findAll({
        where: {
          followerId: userId
        },
        include: {
          model: User,
          as: 'followed'
        }
      })
      
      data.following = following.map((result) => result.get({plain: true}))

      let followers = await Follow.findAll({
        where: {
          followedId: userId
        },
        include: {
          model: User,
          as: 'follower'
        }
      })

      data.followers = followers.map((result) => result.get({plain: true}))

      console.log(data)
      return data
    } catch(err){
      console.log("ERRO: " + err)
    }
  }

  static async CheckIsFollowing(req, res, followedId){

    const userId = req.session.userid

    const userData = await Follow.findOne({
      where: {
        followedId: followedId, 
        followerId: userId
      },
      plain: true
    })

    console.log(userData)
    return userData;
  }

  static async followUnfollow(req, res){
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
      followedId: userToFollow,
      followerId: userId
    }

    Follow.create(follow)
    .then(() => {
      req.session.save(() => {
        res.redirect(req.headers.referer)
      })
    })
  }

  static async showFollowing(req, res){
    const userId = req.params.id || req.session.userid;

    const userData = await User.findOne({
      where: {id: userId},
      plain: true,
    })

    if (!userData){
      res.redirect('/');
      return
    }

    const user = userData.get({plain: true})

    user.follows = await FollowController.prototype.getFollows(user.id);
  
    res.render('denkes/following', {user})
  }

  static async showFollowers(req, res){
    const userId = req.params.id || req.session.userid;

    const userData = await User.findOne({
      where: {id: userId},
      plain: true,
    })

    if (!userData){
      res.redirect('/');
      return
    }

    const user = userData.get({plain: true})

    user.follows = await FollowController.prototype.getFollows(user.id);
  
    res.render('denkes/followers', {user})
  }
}