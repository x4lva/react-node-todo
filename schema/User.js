const mongoose = require("mongoose")
const Schema = mongoose.Schema
const arrayUniquePlugin = require('mongoose-unique-array');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    boards: {
        type: [mongoose.Types.ObjectId],
        default: []
    }
}, {timestamps: true})



module.exports = User = mongoose.model('user', UserSchema)
