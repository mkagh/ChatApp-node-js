
const getMyProfilePage = (req, res) => {

    res.render("myprofile")
}
const getHomePage = (req, res) => {

    res.render("home", { layout: "../views/layouts/homeLayout" })
}
module.exports = { getMyProfilePage, getHomePage }