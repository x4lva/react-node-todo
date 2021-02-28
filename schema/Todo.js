const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TodoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    board_id: {
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

module.exports = Todo = mongoose.model('todo', TodoSchema)
