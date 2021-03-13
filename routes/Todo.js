const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const todo = express.Router();

const Todo = require("../schema/Todo");
const TodoItem = require("../schema/TodoItem");

todo.use(cors());

todo.post("/data", (req, res) => {
    const { todoId } = req.body;

    Todo.findById(todoId)
        .then((todo) => {
            res.json(todo);
        })
        .catch((err) => {
            res.send("error: " + err);
        });
});

todo.post("/board", (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.body.boardId)) {
        Todo.find({ board_id: req.body.boardId })
            .then((todo) => {
                res.json(todo);
            })
            .catch((err) => {
                console.log(err);
                res.send("error: " + err);
            });
    }
});

todo.post("/create", async (req, res) => {
    const { todoName, boardId, userId } = req.body;

    const docCount = await Todo.count({ board_id: boardId }).exec();

    const todoData = {
        name: todoName,
        board_id: boardId,
        creator: userId,
        users: [userId],
        order: docCount,
    };

    Todo.create(todoData)
        .then((todo) => {
            console.log(todo);
            res.status(200).json(todo);
        })
        .catch((err) => {
            console.log(err);

            res.send("error: " + err);
        });
});

todo.post("/update", (req, res) => {
    const { todoData, todoId } = req.body;

    Todo.findByIdAndUpdate(todoId, todoData, {})
        .then((todo) => {
            res.status(200).json({ message: "Todo list has been created" });
        })
        .catch((err) => {
            console.log(err);
            res.send("error: " + err);
        });
});

todo.post("/delete", (req, res) => {
    const { todoId } = req.body;

    Todo.findByIdAndDelete(todoId, {}, (doc) => {})
        .then((todo) => {
            res.status(200).json({
                message: "Todo has been delete successfully",
            });
        })
        .catch((err) => {
            console.log(err);
            res.send("error: " + err);
        });
});

todo.post("/copy", async (req, res) => {
    const { todoId } = req.body;

    Todo.findById({ _id: todoId })
        .then(async (todo) => {
            todo._id = mongoose.Types.ObjectId();
            todo.order = await Todo.count({ board_id: todo.board_id }).exec();
            todo.isNew = true;
            todo.save((result) => {
                TodoItem.find({ todo_id: todoId }).then((todoItem) => {
                    todoItem.forEach((el) => {
                        el._id = mongoose.Types.ObjectId();
                        el.isNew = true;
                        el.todo_id = todo._id;
                        el.save();
                    });
                });

                res.json(todo);
            });
        })
        .catch((err) => {
            res.send("error: " + err);
        });
});

todo.post("/clear", async (req, res) => {
    const { todoId } = req.body;

    await TodoItem.deleteMany({ todo_id: todoId }).then((response) => {
        res.status(200).json({});
    });
});

module.exports = todo;
