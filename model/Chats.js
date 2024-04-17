const mongoose = require("mongoose")

const ChatsShema = new mongoose.Schema({
    participants: {
        type: Array
    },
    chat: {
        type: Array,
    }
})

module.exports = mongoose.model("chat", ChatsShema)