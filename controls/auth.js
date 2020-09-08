const User = require("../models/User");
const bcrypt = require('bcrypt');
const io = require('socket.io');
const colors = require('../util/colors');
const { validationResult } = require('express-validator/check');



exports.getSignup = (req, res, next) => {
    res.render('signup', {
      errorMessage: null
    });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const nickname = req.body.nickname;

  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('signup', {
        errorMessage: errors.array()[0].msg
      });
    }

  try{
  const u = await User.findOne({ email: email })
  const encryptPass = await bcrypt.hash(password, 12);

  const user = new User({
    email: email,
    password: encryptPass,
    nickname: nickname,
    color: colors.sample()
  });
  
  user.save();
  res.redirect('/');
  }catch(err){
    console.log(err);
  }
};

exports.getLogin = (req, res, next) => {
    res.render('login', {
      errorMessage: null
    });
};

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('login', {
        errorMessage: errors.array()[0].msg
      });
    }
    try{
        const u = await User.findOne({email: email});
        if(u){
            const bool = await bcrypt.compare(password, u.password);
            if(bool){
                return res.render('chat', {nickname: u.nickname, color: u.color});
            }
            return res.status(422).render('login', {
              errorMessage: 'Invalid password.'
            });
        }
        res.status(422).render('login', {
          errorMessage: 'Invalid email.'
        });
    }catch(err){
        console.log(err);
    }

}


exports.getChat = (req, res, next) => {
    
    res.render('chat', {
      errorMessage: null
    });
}