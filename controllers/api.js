const Users = require("../model/Users")
const Chats = require("../model/Chats")
const { StatusCodes } = require('http-status-codes')
const { createCustomError } = require("../errors/customError")
const getUser = (req, res) => {
    res.status(StatusCodes.OK).json(req.user)
}

const getAllUsers = async (req, res) => {
    const allUsers = await Users.find({})
    res.status(StatusCodes.OK).json({ allUsers })
}

const getUserToPatch = async (req, res, next) => {
    const {params: { id: username }} = req
    const forPathcing = await Users.findOne({ username })
    if (!forPathcing) {
        return next(createCustomError('cannot find user to pach'))
    }

    res.status(StatusCodes.OK).json(forPathcing)
}

const patchRecivedRequests = async (req, res) => {
    const {params: { id: username }} = req
    const recivedReq = await Users.findOneAndUpdate({ username },
        req.body,
        { new: true, runValidators: true })
    res.status(StatusCodes.OK).json({ recivedReq })
}

const getAllChats = async (req, res) => {
    const allChats = await Chats.find({})
    res.status(StatusCodes.OK).json({ allChats })
}

const populateChats = async (req, res) => {
    const { participants } = req.body
    const newChat = new Chats({
        participants
    }).save()
}
const getOneChat = async (req, res) => {
    const { participants } = req.query;
    const oneChat = await Chats.findOne({ participants: participants.split(",") })
    res.status(StatusCodes.OK).json({ oneChat })
}

const addMessageToChat = async (req, res) => {
    const { participants } = req.body
    const addMessage = await Chats.findOneAndUpdate({ participants },
        req.body,
        { new: true, runValidators: true })
    res.status(StatusCodes.OK).json({ addMessage })
}

module.exports = { getUser, getAllUsers, getUserToPatch, patchRecivedRequests, getAllChats, populateChats, getOneChat, addMessageToChat }