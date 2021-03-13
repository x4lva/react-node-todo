import axios from "axios";

export const getTodoData = async (todoId) => {
    return await axios
        .post("http://localhost:3000/todo/data", { todoId })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getBoardTodos = async (boardId, searchFiled) => {
    return await axios
        .post("http://localhost:3000/todo/board", { boardId, searchFiled })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const createTodo = async (todoName, boardId, userId) => {
    return await axios
        .post("http://localhost:3000/todo/create", {
            todoName,
            boardId,
            userId,
        })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const updateTodo = async (todoData, todoId) => {
    return await axios
        .post("http://localhost:3000/todo/update", { todoData, todoId })
        .then((res) => {
            return res.status;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const deleteTodo = async (todoId) => {
    return await axios
        .post("http://localhost:3000/todo/delete", { todoId })
        .then((res) => {
            return res.status;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const copyTodo = async (todoId) => {
    return await axios
        .post("http://localhost:3000/todo/copy", { todoId })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const clearTodo = async (todoId) => {
    return await axios
        .post("http://localhost:3000/todo/clear", { todoId })
        .then((res) => {
            return res.status;
        })
        .catch((err) => {
            console.log(err);
        });
};
