const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TodoItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: Text,
        default: ''
    },
    board_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    users: {
        type: [{
            type: mongoose.Types.ObjectId,
            unique: true
        }],
        default: []
    }
}, {timestamps: true})

module.exports = TodoItem = mongoose.model('todoItem', TodoItemSchema)
