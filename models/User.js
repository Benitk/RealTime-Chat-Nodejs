const mongoose = require('mongoose');


// simple user schema 

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);