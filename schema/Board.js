const mongoose = require("mongoose")
const Schema = mongoose.Schema

const BoardScheme = new Schema({
    name: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    users: {
        type: [String],
        default: []
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = Board = mongoose.model('board', BoardScheme)
