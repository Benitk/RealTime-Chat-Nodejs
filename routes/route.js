const express = require('express');
const { body } = require('express-validator/check');
const User = require('../models/User');


const router = express.Router();

const authControlles = require('../controller/auth');

router.get('/signup', authControlles.getSignup);

router.post('/signup',  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password - only numbers and text and at least 6 characters.'
    )
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
    body('password_confirmed')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          console.log(value);
          console.log(req,body.password);

          throw new Error('Passwords are not match!');
        }
        return true;
      }),
    body(
      'nickname',
      'nickname must contains ASCII chars only'
    )
    .trim()
    .isAlpha()
  ], authControlles.postSignup);

router.post('/login', [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim()
  ], authControlles.postLogin);

// router.get('/chat', authControlles.getChat);

router.get('/', authControlles.getLogin);

module.exports = router;