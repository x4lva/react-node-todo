const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TodoItemCommentSchema = new Schema({
    text: {
        type: Text,
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        default: true
    },
    todo_id: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, {timestamps: true})

module.exports = TodoItemComment = mongoose.model('todoItem', TodoItemCommentSchema)
