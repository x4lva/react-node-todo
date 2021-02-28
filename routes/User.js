const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const user = express.Router()

const User = require('../schema/User')
const Board = require('../schema/Board')

process.env.SECRET_KEY = 'x4lva'

user.post("/connect", (req, res) => {
    User.findByIdAndUpdate(req.body.userId, { $addToSet: {boards: new String(req.body.boardId)}})
        .then(board => {
            res.json({ status: 200 })

            Board.findByIdAndUpdate({_id: req.body.boardId}, { $addToSet: {users: new String(req.body.userId)}}, (docs) => {})

        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

user.post("/login", (req, res) => {
    User.findOne({
        email: req.body.userEmail
    })
    .then(user => {
        if (user) {
            if (bcrypt.compareSync(req.body.userPassword, user.password)) {
                const payload = {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.send(token)
            } else {
                res.json({ error: 'Password is wrong' })
            }
        } else {
            res.json({ error: 'User does not exist' })
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

user.post("/register", (req, res) => {
    const userData = {
        name: req.body.userName,
        email: req.body.userEmail,
        password: req.body.userPassword,
        boards: [],
        created_at: new Date()
    }
    User.findOne({
        email: req.body.userEmail
    })
    .then(user => {
        if (!user) {
            bcrypt.hash(req.body.userPassword, 10, (err, hash) => {
                userData.password = hash
                User.create(userData)
                    .then(user => {
                        res.json({ status: 200 })
                    })
                    .catch(err => {
                        res.send('error: ' + err)
                    })
            })
        } else {
            res.json({ error: 'User already exists' })
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

user.post("/data", (req, res) => {
    console.log(req.body)

    User.findOne({_id: req.body.userId})
        .then((user) => {
            res.json(user)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

module.exports = user