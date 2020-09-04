const User = require("../models/User");
const bcrypt = require('bcrypt');
const io = require('socket.io');


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

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try{
        const u = await User.findOne({email: email});
        console.log(u);
        if(u){
            const bool = await bcrypt.compare(password, u.password);
            if(bool){
                return res.redirect('/chat');
            };

        }
        console.log("email doesnt exist");
        res.status(400).redirect('/');
    }catch(err){
        console.log(err);
    }

}
exports.getHomepage = (req, res, next) => {
    res.render('homepage');
};

exports.getChat = (req, res, next) => {
    
    res.render('chat');
}