const express = require('express');

const router = express.Router();

const authControlles = require('../controls/auth');

router.get('/signup', authControlles.getSignup);

router.get('/login', authControlles.getLogin);

router.get('/', authControlles.getHomepage);

module.exports = router;