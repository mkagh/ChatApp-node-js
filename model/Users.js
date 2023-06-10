const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');

const UsersShema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    friends: {
        type: Array,
        required: true,
        default: []
    },
    recieved: {
        type: Array,
        required: true,
        default: []

    },
    sent: {
        type: Array,
        required: true,
        default: []
    }
})

module.exports = mongoose.model("user", UsersShema)