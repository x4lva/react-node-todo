const express = require('express')
const cors = require('cors')
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
    Todo.find({board_id: new String(req.body.boardId)})
        .then(todo => {
            res.json(todo)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

todo.post("/create", (req, res) => {

    const {todoName, boardId, userId} = req.body

    const todoData = {
        name: todoName,
        board_id: boardId,
        creator: userId,
        users: [userId],
        created_at: new Date(),
        updated_at: new Date()
    }

    Todo.create(todoData)
        .then(todo => {
            res.status(200).json({message: "Todo list has been created"})
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

todo.post("/update", (req, res) => {

    const {todoData} = req.body


    Todo.findByIdAndUpdate(todoData._id, todoData,{setDefaultsOnInsert: true}, (doc) => {})
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