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

module.exports = TodoItem = mongoose.model('todoItem', TodoItemSchema)
