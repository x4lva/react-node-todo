const express = require("express");
const mongoose = require("mongoose");
const boardMessage = express.Router();

const BoardMessage = require("../schema/BoardMessage");

boardMessage.post("/create", async (req, res) => {
    const { boardId, messageCreator, messageText } = req.body;

    const messageData = {
        text: messageText,
        creator: mongoose.Types.ObjectId(messageCreator),
        board: mongoose.Types.ObjectId(boardId),
    };

    BoardMessage.create(messageData).then((response) => {
        res.status(200).json(response);
    });
});

boardMessage.post("/get", async (req, res) => {
    const { boardId } = req.body;

    BoardMessage.find({ board: boardId })
        .limit(50)
        .sort({ _id: -1 })
        .then((response) => {
            res.status(200).json(response);
        });
});

module.exports = boardMessage;
