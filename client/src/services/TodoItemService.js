import axios from "axios";

export const createTodoItem = (todoId, userId, todoItemName) => {
    return axios
        .post("http://localhost:3000/todoitem/create", {
            todoId,
            userId,
            todoItemName,
        })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getTodoItemsList = (todoId) => {
    return axios
        .post("http://localhost:3000/todoitem/get", { todoId })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const updateTodoItem = async (todoItemData) => {
    return await axios
        .post("http://localhost:3000/todoitem/update", { todoItemData })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
        });
};
export const deleteTodosItem = (todoItemId) => {
    return axios
        .post("http://localhost:3000/todoitem/delete", { todoItemId })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
        });
};
