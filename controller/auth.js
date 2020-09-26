const User = require("../models/User");
const bcrypt = require('bcrypt');
const io = require('socket.io');
const colors = require('../util/colors');
const { validationResult } = require('express-validator/check');
const { v4: uuidV4 } = require('uuid')




exports.getSignup = (req, res, next) => {
  res.render('signup', {
    errorMessage: null
  });
};

 // getting user input from signup form
 // then creating new user and storing it in mongodb
 //after encrypting the password using bcrypt

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

  try {
    const encryptPass = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: encryptPass,
      nickname: nickname,
      color: colors.sample()
    });

    user.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

exports.getLogin = (req, res, next) => {
  res.render('login', {
    errorMessage: null
  });
};


 // getting user input from login form
 // then validate user by fetching it from mongodb
 // and decrypting the password using bcrypt
 // if user exist redirect to the videochat lobby create room id by uuid
 // and sharing the user info by the session 

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('login', {
      errorMessage: errors.array()[0].msg
    });
  }
  try {
    const u = await User.findOne({ email: email });
    if (u) {
      const bool = await bcrypt.compare(password, u.password);
      if (bool) {
        req.session.isLoggedIn = true;
        req.session.user = u;
        return res.redirect(`/video&chat/${uuidV4()}`);
      }
      return res.status(422).render('login', {
        errorMessage: 'Invalid password.'
      });
    }
    console.log("email doesnt exist");
    res.status(422).render('login', {
      errorMessage: 'Invalid email.'
    });
  } catch (err) {
    console.log(err);
  }

}

exports.getVideoChat = async (req, res, next) => {
  return res.render('chat', {
    nickname: req.user.nickname,
    color: req.user.color,
    roomID: req.params.roomID
  });
}


exports.getLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
};
