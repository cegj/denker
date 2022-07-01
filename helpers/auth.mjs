import { User } from "../models/User.mjs";

export default async function checkAuth(req, res, next){

  const userId = req.session.userid;

  if (userId){
    next();
  } else {
    req.session.destroy();
    res.redirect('/login');
  }

}