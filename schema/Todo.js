const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TodoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    board_id: {
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
    }
}, {timestamps: true})

module.exports = Todo = mongoose.model('todo', TodoSchema)
