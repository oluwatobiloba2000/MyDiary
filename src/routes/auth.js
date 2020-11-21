const express = require('express');
const { default: Authentication } = require('../controllers/auth');
const router = express.Router();


router.post('/users/login', Authentication.login);
router.post('/users/signup', Authentication.signup);


module.exports = router;