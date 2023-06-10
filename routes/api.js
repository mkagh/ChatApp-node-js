const express = require("express")
const router = express.Router()

const { getUser, getAllUsers, getUserToPatch, patchRecivedRequests, getAllChats, populateChats, getOneChat, addMessageToChat } = require("../controllers/api")

router.route("/user").get(getUser)
router.route("/allusers").get(getAllUsers)
router.route("/chats").get(getAllChats).post(populateChats)
router.route("/chat").get(getOneChat).patch(addMessageToChat)

router.route("/:id").get(getUserToPatch).patch(patchRecivedRequests)


module.exports = router