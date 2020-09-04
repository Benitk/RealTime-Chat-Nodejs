const express = require('express');

const router = express.Router();

const authControlles = require('../controls/auth');

router.get('/signup', authControlles.getSignup);

router.post('/signup', authControlles.postSignup);

router.get('/login', authControlles.getLogin);

router.post('/login', authControlles.postLogin);


router.get('/chat', authControlles.getChat);

router.get('/', authControlles.getHomepage);

module.exports = router;