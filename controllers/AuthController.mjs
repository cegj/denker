import { User } from "../models/User.mjs";
import bcryptjs from "bcryptjs";
import md5 from "md5";

export default class AuthController {

  static login(req, res) {
    res.render('auth/login')
  }

  static async loginPost(req, res) {

    if(req.session.userid){
      req.session.destroy();
    }

    const {email, password} = req.body;

    //Find user
    const user = await User.findOne({where: {email: email}})
    if (!user){
      req.flash('message', 'O e-mail informado não está cadastrado');
      res.render('auth/login');
      return
    }

    //Check if password match
    const passwordMatch = bcryptjs.compareSync(password, user.password)
    if (!passwordMatch){
      req.flash('message', 'Senha incorreta');
      res.render('auth/login');
      return     
    }

    try {
      // Initialize session
      req.session.userid = user.id;

      req.flash('message', 'Login realizado com sucesso!');

      req.session.save(() => {
        res.redirect('/denkes');
      })

    } catch (err) {
      console.log(err);
    }

  }

  static register(req, res) {
    res.render('auth/register')
  }

  static async registerPost(req,res){

    const { name, username, email, password, confirmpassword } = req.body

    const hashedEmail = md5(email.toLowerCase().trim());

    //Password match validation
    if (password != confirmpassword){
      req.flash('message', 'As senhas não conferem, tente novamente!');
      res.render('auth/register');
      return
    }

    //Check if e-mail exists
    const emailExists = await User.findOne({where: {email: email}})
    if (emailExists){

      req.flash('message', 'O e-mail já está cadastrado, faça login ou tente novamente!');
      res.render('auth/register');

      return
    }

    //Check if username exists
    const userExists = await User.findOne({where: {username: username}})
    if (userExists){
      req.flash('message', 'O nome de usuário já existe, tente um diferente!');
      res.render('auth/register');
      return
    }

    // Create password
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    const user = {
      name,
      username,
      email,
      hashedEmail,
      password: hashedPassword
    }

    try {
      const createdUser = await User.create(user)

      // Initialize session
      req.session.userid = createdUser.id;

      req.flash('message', 'Cadastro realizado com sucesso!');

      req.session.save(() => {
        res.redirect('/');
      })

    } catch (err) {
      console.log(err);
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect('/login')
  }
}