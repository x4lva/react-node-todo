const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TodoItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    todo_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    users: {
        type: [mongoose.Types.ObjectId],
        default: []
    },
    order: {
        type: Number,
        default: undefined
    }
}, {timestamps: true})

module.exports = TodoItem = mongoose.model('todoItem', TodoItemSchema)
