const mongoose = require("mongoose")
const Schema = mongoose.Schema

const BoardScheme = new Schema({
    name: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    users: {
        type: [mongoose.Types.ObjectId],
        default: []

    }
}, {timestamps: true})

module.exports = Board = mongoose.model('board', BoardScheme)
