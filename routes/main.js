const express = require("express")
const router = express.Router()
const { getMyProfilePage, getHomePage } = require("../controllers/main")
const { ensureAuthenticated } = require('../config/auth');

router.route("/").get(ensureAuthenticated, getHomePage)
router.route("/:id").get(ensureAuthenticated, getMyProfilePage)


module.exports = router