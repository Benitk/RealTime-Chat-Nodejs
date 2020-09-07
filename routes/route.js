const express = require('express');

const router = express.Router();

const authControlles = require('../controls/auth');

router.get('/signup', authControlles.getSignup);

router.post('/signup', authControlles.postSignup);

router.post('/login', authControlles.postLogin);

router.get('/chat', authControlles.getChat);

router.get('/', authControlles.getLogin);

module.exports = router;