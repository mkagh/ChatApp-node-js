const express = require('express')
const router = express.Router()
const { forwardAuthenticated } = require('../config/auth');

const { getRegisterPage, getLoginPage, postRegisterPage, postLoginPage } = require('../controllers/auth')

router.route("/register").get(forwardAuthenticated, getRegisterPage).post(postRegisterPage)
router.route("/login").get(forwardAuthenticated, getLoginPage).post(postLoginPage)

module.exports = router