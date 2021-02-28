const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TodoItemCommentSchema = new Schema({
    text: {
        type: Text,
        required: true
    },
    author: {
        type: String,
        default: true
    },
    todo_id: {
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
    }
})

module.exports = TodoItemComment = mongoose.model('todoItem', TodoItemCommentSchema)
