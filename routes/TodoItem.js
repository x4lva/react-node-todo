const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const todoItem = express.Router()

const TodoItem = require("../schema/TodoItem")

todoItem.post("/create", async (req, res) => {
    const {userId, todoItemName, todoId} = req.body

    const docCount = await TodoItem.count({todo_id: todoId}).exec()

    const todoItemData = {
        name: todoItemName,
        creator: userId,
        todo_id: todoId,
        order: docCount
    }

    TodoItem.create(todoItemData).then(todoItem => {
        console.log(todoItem)
        res.status(200).json(todoItem)
    })
})

todoItem.post("/get", (req, res) => {
    const {todoId} = req.body

    TodoItem.find({todo_id: todoId}).then(todoItem => {
        res.status(200).json(todoItem)
    })
})

todoItem.post("/update", (req, res) => {
    const {todoItemData} = req.body

    console.log(todoItemData)

    TodoItem.findByIdAndUpdate({_id: todoItemData._id}, todoItemData, {new: true})
        .then(todoItem => {
            res.status(200).json(todoItem)
    })
})

todoItem.post("/delete", (req, res) => {
    const {todoItemId} = req.body

    TodoItem.deleteOne({_id: todoItemId})
        .then(response => {
            res.status(200)
        })
})

module.exports = todoItem