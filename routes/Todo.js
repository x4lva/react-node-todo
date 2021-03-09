
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const todo = express.Router()

const Todo = require('../schema/Todo')

todo.use(cors())

todo.post("/data", (req, res) => {

    const {todoId} = req.body

    Todo.findById(todoId)
        .then(todo => {
            res.json(todo)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

todo.post("/board", (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.body.boardId)){
        Todo.find({board_id: req.body.boardId})
            .then(todo => {
                res.json(todo)
            })
            .catch(err => {
                console.log(err)
                res.send('error: ' + err)
            })
    }
})

todo.post("/create", (req, res) => {

    const {todoName, boardId, userId} = req.body

    const todoData = {
        name: todoName,
        board_id: boardId,
        creator: userId,
        users: [userId]
    }

    Todo.create(todoData)
        .then(todo => {
            console.log(todo)
            res.status(200).json(todo)
        })
        .catch(err => {
            console.log(err)

            res.send('error: ' + err)
        })
})

todo.post("/update", (req, res) => {

    const {todoData, todoId} = req.body

    console.log(todoData)


    Todo.findByIdAndUpdate(todoId, todoData, {})
        .then(todo => {
            res.status(200).json({message: "Todo list has been created"})
        })
        .catch(err => {
            console.log(err)
            res.send('error: ' + err)
        })
})



todo.post("/delete", (req, res) => {

    const {todoId} = req.body


    Todo.findByIdAndDelete(todoId,{}, (doc) => {})
        .then(todo => {
            res.status(200).json({message: "Todo has been delete successfully"})
        })
        .catch(err => {
            console.log(err)
            res.send('error: ' + err)
        })
})

module.exports = todo