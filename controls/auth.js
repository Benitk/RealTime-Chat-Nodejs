const User = require("../models/User");
const bcrypt = require('bcrypt');


exports.getSignup = (req, res, next) => {
    res.render('signup');
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try{
  const u = await User.findOne({ email: email })
  // check if exist
  if(u){
    console.log('email already exist')
    return res.redirect('/signup');
  }
  const encryptPass = await bcrypt.hash(password, 12);

  const user = new User({
    email: email,
    password: encryptPass,
  });
  
  user.save();
  res.redirect('/login');
  }catch(err){
    console.log(err);
  }
};

exports.getLogin = (req, res, next) => {
    res.render('login');
};

exports.getHomepage = (req, res, next) => {
    res.render('homepage');
};