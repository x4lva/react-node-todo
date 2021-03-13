const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoardMessageScheme = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        creator: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        board: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = BoardMessage = mongoose.model(
    "boardMessage",
    BoardMessageScheme
);
