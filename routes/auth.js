
//2 endpoint routes signup and signin

//We have imported our two methods signin and
// signup from controllers

//controllers have authentication logic

const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/auth');
router.post('/signup', signup);
router.post('/signin', signin);
module.exports = router;

