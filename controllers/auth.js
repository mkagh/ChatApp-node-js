const Users = require("../model/Users")
const passport = require("passport")

const getLoginPage = (req, res) => {
    res.render("login", { layout: "../views/layouts/authLayout" })
}

const getRegisterPage = (req, res) => {
    res.render("register", { layout: "../views/layouts/authLayout" })
}

const postRegisterPage = (req, res, next) => {
    passport.authenticate('register', {
        successRedirect: '/',
        failureRedirect: '/register',
    })(req, res, next);
}

const postLoginPage = async (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: false
    })(req, res, next);
}

module.exports = { getLoginPage, getRegisterPage, postRegisterPage, postLoginPage }