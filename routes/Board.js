const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const board = express.Router()

const Board = require('../schema/Board')
const User = require('../schema/User')

board.use(cors())

board.post('/create', (req, res) => {
    const boardData = {
        name: req.body.boardName,
        creator: req.body.userId,
        users: [req.body.userId]
    }

    Board.create(boardData)
        .then(board => {
            res.json({ status: board.name + 'Created!' })
            User.findByIdAndUpdate({_id: req.body.userId}, { $addToSet: {boards: new String(board._id)}}, (doct)=>{})

        })
        .catch(err => {
            res.send('error: ' + err)
        })
})


board.get('/data/:id', (req, res) => {
    Board.findById(req.params.id)
        .then(board => {
            res.json(board)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

board.post('/add/member', (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.body.userId)){
        User.findById(req.body.userId)
            .then(user => {
                if (user){
                    Board.findByIdAndUpdate(req.body.boardId, {$addToSet: {users: new String(user._id)}}, (doct)=>{})
                        .then(board => {
                            res.json({status: 200, message: 'User has added to board successfully'})
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                }else{
                    res.json({status: 501, message: 'User with this id is not exist'})
                }
            })
            .catch(err => {
                res.send('error: ' + err)
            })
    }else{
        res.json({status: 501, message: 'Invalid user id'})
    }
})

board.post('/get/users',  (req, res) => {

     const {boardId} = req.body

     Board.findById(boardId)
        .then(board =>  {
             const users = board.users.map(user => {
                 return User.findById({_id: user}).then(res => { return {_id: res._id,name: res.name, email: res.email}})
            })
            Promise.all(users)
                .then(response => {
                    res.json(response)
                })
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

board.post('/update',  (req, res) => {
    let {boardData} = req.body

    Board.findByIdAndUpdate(boardData._id, {$addToSet: {users: boardData.users}, ...boardData}, {new: true})
        .then(board =>  {
            console.log(board)
            res.status(200).json(board)
        })
        .catch(err => {
            console.log(err)
            res.send('error: ' + err)
        })
})

module.exports = board