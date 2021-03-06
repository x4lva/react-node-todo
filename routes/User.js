const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const user = express.Router();

const User = require("../schema/User");
const Board = require("../schema/Board");

process.env.SECRET_KEY = "x4lva";

user.post("/login", (req, res) => {
    User.findOne({
        email: req.body.userEmail,
    })
        .then((user) => {
            if (user) {
                if (bcrypt.compareSync(req.body.userPassword, user.password)) {
                    const payload = {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                    };
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 1440,
                    });
                    res.send(token);
                } else {
                    res.json({ error: "Password is wrong" });
                }
            } else {
                res.json({ error: "User does not exist" });
            }
        })
        .catch((err) => {
            res.send("error: " + err);
        });
});

user.post("/register", (req, res) => {
    console.log(req.body);
    const userData = {
        name: req.body.userName,
        email: req.body.userEmail,
        password: req.body.userPassword,
        boards: [],
    };
    User.findOne({
        email: req.body.userEmail,
    })
        .then((user) => {
            if (!user) {
                bcrypt.hash(req.body.userPassword, 10, (err, hash) => {
                    userData.password = hash;
                    User.create(userData)
                        .then((user) => {
                            console.log(user);
                            res.json({ status: 200 });
                        })
                        .catch((err) => {
                            res.send("error: " + err);
                        });
                });
            } else {
                res.json({ error: "User already exists" });
            }
        })
        .catch((err) => {
            res.send("error: " + err);
        });
});

user.post("/data", (req, res) => {
    User.findOne({ _id: req.body.userId })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            res.send("error: " + err);
        });
});

user.post("/update", async (req, res) => {
    const { userData } = req.body;

    User.findByIdAndUpdate(userData._id, userData, { new: true })
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => {
            res.send("error: " + err);
        });
});

user.post("/update/board", (req, res) => {
    const { userId, boardId } = req.body;

    console.log(userId, boardId);

    if (
        mongoose.Types.ObjectId.isValid(userId) &&
        mongoose.Types.ObjectId.isValid(boardId)
    ) {
        User.findByIdAndUpdate(
            { _id: userId },
            { $addToSet: { boards: mongoose.Types.ObjectId(boardId) } },
            { new: true }
        )
            .then((user) => {
                Board.findOneAndUpdate(
                    { _id: boardId },
                    { $addToSet: { users: userId } },
                    { new: true }
                )
                    .then((board) => {
                        res.status(200).json({
                            boardId: board._id,
                            status: 200,
                        });
                    })
                    .catch((err) => {
                        res.json({ message: err, status: 501 });
                    });
            })
            .catch((err) => {
                res.json({ message: err, status: 501 });
            });
    } else {
        res.json({ message: "User id is not valid", status: 501 });
    }
});

user.post("/leave", (req, res) => {
    const { userId, boardId } = req.body;

    console.log(userId, boardId);

    User.findByIdAndUpdate(
        { _id: userId },
        { $pull: { boards: boardId } }
    ).then((res) => {});

    Board.findByIdAndUpdate(
        { _id: boardId },
        { $pull: { users: userId } }
    ).then((res) => {});
});

module.exports = user;
