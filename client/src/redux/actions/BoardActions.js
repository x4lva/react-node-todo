import { UPDATE_BOARD_DATA } from "../types/BoardTypes";
import {
    getBoardData,
    getBoardUsers,
    updateBoardData,
} from "../../services/BoardService";
import { addUserBoard } from "../../services/UserService";
import { ToastsStore } from "react-toasts";
import {
    clearTodo,
    copyTodo,
    createTodo,
    deleteTodo,
    getBoardTodos,
    updateTodo,
} from "../../services/TodoService";
import {
    createTodoItem,
    deleteTodosItem,
    getTodoItemsList,
    updateTodoItem,
} from "../../services/TodoItemService";
import socket from "../../utilities/OpenSocket";
import {
    createBoardMessage,
    getBoardMessages,
} from "../../services/BoardMessegeService";

export const setBoardDataState = (payload) => {
    return {
        type: UPDATE_BOARD_DATA,
        payload,
    };
};

export const getBoardState = (boardId) => async (dispatch, getState) => {
    getBoardData(boardId).then((board) => {
        dispatch(
            setBoardDataState({
                boardData: { ...board },
            })
        );
    });

    getBoardUsers(boardId).then((user) => {
        dispatch(
            setBoardDataState({
                boardUsersData: user,
            })
        );
    });

    getBoardTodos(boardId, getState().boardState.boardSearchValue).then(
        (todos) => {
            dispatch(
                setBoardDataState({
                    boardTodoLists: todos,
                })
            );
        }
    );

    getBoardMessages(boardId).then((res) => {
        dispatch(
            setBoardDataState({
                boardMessages: res,
            })
        );
    });

    dispatch(
        setBoardDataState({
            boardIsLoading: false,
        })
    );

    dispatch(
        setBoardDataState({
            boardTodoListItems: [],
        })
    );

    // getState().boardState.boardTodoLists.forEach((el) => {
    //     getTodoItemsList(el._id).then((items) => {
    //         dispatch(
    //             setBoardDataState({
    //                 boardTodoListItems: {
    //                     ...getState().boardState.boardTodoListItems,
    //                     [el._id]: items,
    //                 },
    //             })
    //         );
    //     });
    // });
};

export const updateBoardDataState = (boardData) => (dispatch, getState) => {
    updateBoardData({
        ...boardData,
        _id: getState().boardState.boardData._id,
    }).then((board) => {
        if (board.status === 200) {
            dispatch(
                setBoardDataState({
                    boardData: { ...board.data },
                })
            );
            getBoardUsers(getState().boardState.boardData._id).then((user) => {
                dispatch(
                    setBoardDataState({
                        boardUsersData: user,
                    })
                );
            });
        }
    });
};

export const addMemberToBoard = (userId, boardId) => (dispatch, getState) => {
    addUserBoard(userId, boardId).then((response) => {
        if (response.status === 200) {
            getBoardUsers(boardId).then((user) => {
                dispatch(
                    setBoardDataState({
                        boardUsersData: user,
                    })
                );
            });
            socket.emit("board-user", getState().boardState.boardData._id);
            ToastsStore.success("User has been created");
        } else {
            ToastsStore.error(response.data.message);
        }
    });
};

export const toggleBoardAddMember = () => (dispatch, getState) => {
    dispatch(
        setBoardDataState({
            boardAddMember: !getState().boardState.boardAddMember,
        })
    );
};

export const changeBoardAddMemberId = (memberId) => (dispatch, getState) => {
    dispatch(
        setBoardDataState({
            boardAddMemberId: memberId,
        })
    );
};

export const toggleAddBoardTodo = (state) => (dispatch, getState) => {
    dispatch(
        setBoardDataState({
            boardTodoCreate: state,
        })
    );
};

export const changeBoardAddTodo = (todoName) => (dispatch, getState) => {
    dispatch(
        setBoardDataState({
            boardTodoCreateName: todoName,
        })
    );
};

export const boardCreateTodoList = () => (dispatch, getState) => {
    if (getState().boardState.boardTodoCreateName !== "") {
        createTodo(
            getState().boardState.boardTodoCreateName,
            getState().boardState.boardData._id,
            getState().userState.userData._id
        ).then((res) => {
            getBoardTodos(
                getState().boardState.boardData._id,
                getState().boardState.boardSearchValue
            ).then((todos) => {
                console.log(todos);

                dispatch(
                    setBoardDataState({
                        boardTodoLists: todos,
                    })
                );
                ToastsStore.success("Todo list has been created successfully");
            });
        });
        dispatch(
            setBoardDataState({
                boardTodoCreateName: "",
            })
        );
        socket.emit("board-update", {
            boardId: getState().boardState.boardData._id,
            userName: getState().userState.userData.name,
        });
    } else {
        ToastsStore.error("Todo list name can not be empty");
    }
};

export const deleteTodoBoard = (todoListId) => (dispatch, getState) => {
    deleteTodo(todoListId).then((res) => {
        ToastsStore.success("Todo list has been deleted");

        const todoLists = getState().boardState.boardTodoLists;

        const deletedIndex = todoLists.findIndex((el) => el._id === todoListId);

        todoLists.splice(deletedIndex, 1);

        todoLists.forEach((el) => {
            if (el.order > deletedIndex && el._id !== todoListId) {
                updateTodo({ order: el.order - 1 }, el._id);
                el.order -= 1;
            }
        });

        dispatch(
            setBoardDataState({
                boardTodoLists: [...todoLists],
            })
        );
    });
    socket.emit("board-update", {
        boardId: getState().boardState.boardData._id,
        userName: getState().userState.userData.name,
    });
};

export const updateTodoList = (todoData, todoId) => (dispatch, getState) => {
    updateTodo(todoData, todoId).then((res) => {
        getBoardTodos(
            getState().boardState.boardData._id,
            getState().boardState.boardSearchValue
        ).then((todos) => {
            dispatch(
                setBoardDataState({
                    boardTodoLists: todos,
                })
            );
        });
    });
    socket.emit("board-update", {
        boardId: getState().boardState.boardData._id,
        userName: getState().userState.userData.name,
    });
};

export const createTodoListItem = (todoId, todoItemName) => (
    dispatch,
    getState
) => {
    if (todoItemName !== "") {
        createTodoItem(
            todoId,
            getState().userState.userData._id,
            todoItemName
        ).then((res) => {
            const newItem = {
                ...getState().boardState.boardTodoListItems,
                [todoId]: [
                    ...getState().boardState.boardTodoListItems[todoId],
                    res,
                ],
            };

            dispatch(
                setBoardDataState({
                    boardTodoListItems: newItem,
                })
            );
            socket.emit("board-update-todos", {
                boardId: getState().boardState.boardData._id,
                userName: getState().userState.userData.name,
            });
            ToastsStore.success("Todo list item hes been created successfully");
        });
    } else {
        ToastsStore.error("Todo list item name can not be empty");
    }
};

export const getTodoListItems = (todoId) => async (dispatch, getState) => {
    await getTodoItemsList(todoId).then(async (res) => {
        dispatch(
            setBoardDataState({
                boardTodoListItems: {
                    ...getState().boardState.boardTodoListItems,
                    [todoId]: [...res],
                },
            })
        );
    });
};

export const reorderCurrentTodoListItems = (
    todoListId,
    sourceIndex,
    destIndex
) => async (dispatch, getState) => {
    const todoItemsList = getState().boardState.boardTodoListItems;

    const currentTodoList = todoItemsList[todoListId];
    const source = currentTodoList[sourceIndex];

    currentTodoList.splice(sourceIndex, 1);
    currentTodoList.splice(destIndex, 0, source);

    currentTodoList.forEach((el, index) => {
        updateTodoItem({ _id: el._id, order: index });
        el.order = index;
    });

    dispatch(
        setBoardDataState({
            boardTodoListItems: { ...todoItemsList, currentTodoList },
        })
    );
    socket.emit("board-update-todos", {
        boardId: getState().boardState.boardData._id,
        userName: getState().userState.userData.name,
    });
};

export const moveTodoItemToList = (
    fromTodoId,
    toTodoId,
    sourceIndex,
    destIndex
) => (dispatch, getState) => {
    const todoItemsList = getState().boardState.boardTodoListItems;

    let fromTodo = todoItemsList[fromTodoId];
    let toTodo = todoItemsList[toTodoId];
    const source = todoItemsList[fromTodoId][sourceIndex];

    source.order = destIndex;
    updateTodoItem({ _id: source._id, order: destIndex });

    fromTodo.splice(sourceIndex, 1);

    fromTodo.forEach((el) => {
        if (el.order > sourceIndex) {
            updateTodoItem({ _id: el._id, order: el.order - 1 });
            el.order -= 1;
        }
    });

    toTodo.splice(destIndex, 0, source);

    toTodo.forEach((el) => {
        if (el.order >= destIndex && el._id !== source._id) {
            updateTodoItem({ _id: el._id, order: el.order + 1 });
            el.order += 1;
        }
    });

    updateTodoItem({ _id: source._id, todo_id: toTodoId });

    dispatch(
        setBoardDataState({
            boardTodoListItems: { ...todoItemsList, fromTodo, toTodo },
        })
    );
    socket.emit("board-update-todos", {
        boardId: getState().boardState.boardData._id,
        userName: getState().userState.userData.name,
    });
};

export const deleteTodoItem = (todoItemId, todoId) => (dispatch, getState) => {
    deleteTodosItem(todoItemId);

    const todoItemsList = getState().boardState.boardTodoListItems;

    const currentList = todoItemsList[todoId];

    const deleteItem = currentList.findIndex((el) => el._id === todoItemId);

    currentList.splice(deleteItem, 1);

    currentList.forEach((el) => {
        if (el.order > deleteItem && el._id !== todoItemId) {
            updateTodoItem({ _id: el._id, order: el.order - 1 });
            el.order -= 1;
        }
    });

    dispatch(
        setBoardDataState({
            boardTodoListItems: { ...todoItemsList, currentList },
        })
    );
    ToastsStore.success("Todo list item hes been deleted successfully");
    socket.emit("board-update-todos", {
        boardId: getState().boardState.boardData._id,
        userName: getState().userState.userData.name,
    });
};

export const reorderTodoList = (todoId, sourceIndex, destIndex) => (
    dispatch,
    getState
) => {
    const todos = getState().boardState.boardTodoLists;

    const currentList = todos[sourceIndex];

    todos.splice(sourceIndex, 1);
    todos.splice(destIndex, 0, currentList);

    todos.forEach((el, index) => {
        updateTodo({ order: index }, el._id);
        el.order = index;
    });

    dispatch(
        setBoardDataState({
            boardTodoLists: [...todos],
        })
    );
    socket.emit("board-update", {
        boardId: getState().boardState.boardData._id,
        userName: getState().userState.userData.name,
    });
};

export const changeSearchValue = (searchValue) => (dispatch, getState) => {
    if (searchValue === "") {
        dispatch(
            setBoardDataState({
                boardIsSorted: false,
            })
        );
    }
    dispatch(
        setBoardDataState({
            boardSearchValue: searchValue,
        })
    );
};

export const sortSearchValue = () => (dispatch, getState) => {
    const todos = getState().boardState.boardTodoLists;

    const result = todos.filter((el) =>
        el.name
            .toLowerCase()
            .includes(getState().boardState.boardSearchValue.toLowerCase())
    );

    dispatch(
        setBoardDataState({
            boardIsSorted: true,
            boardSortedList: [...result],
        })
    );
};

export const copyTodoToCurrentBoard = (todoId) => async (
    dispatch,
    getState
) => {
    copyTodo(todoId).then((res) => {
        dispatch(
            setBoardDataState({
                boardTodoLists: [...getState().boardState.boardTodoLists, res],
            })
        );
        getTodoItemsList(res._id).then((items) => {
            dispatch(
                setBoardDataState({
                    boardTodoListItems: {
                        ...getState().boardState.boardTodoListItems,
                        [res._id]: items,
                    },
                })
            );
        });
    });
    socket.emit("board-update", {
        boardId: getState().boardState.boardData._id,
        userName: getState().userState.userData.name,
    });
};

export const clearTodoList = (todoId) => (dispatch, getState) => {
    clearTodo(todoId);
    const todoItems = getState().boardState.boardTodoListItems;

    dispatch(
        setBoardDataState({
            boardTodoListItems: { ...todoItems, [todoId]: [] },
        })
    );
    socket.emit("board-update-todos", {
        boardId: getState().boardState.boardData._id,
        userName: getState().userState.userData.name,
    });
};

export const boardUpdateTodos = () => (dispatch, getState) => {
    getBoardTodos(
        getState().boardState.boardData._id,
        getState().boardState.boardSearchValue
    ).then((todos) => {
        dispatch(
            setBoardDataState({
                boardTodoLists: todos,
            })
        );
    });
};

export const toggleBoardChat = (state) => (dispatch, getState) => {
    dispatch(
        setBoardDataState({
            boardChatShow: state,
        })
    );
};

export const boardMessageChangeText = (messageText) => (dispatch, getState) => {
    dispatch(
        setBoardDataState({
            boardMessageText: messageText,
        })
    );
};

export const boardSendMessage = () => async (dispatch, getState) => {
    await createBoardMessage(
        getState().boardState.boardData._id,
        getState().boardState.boardMessageText,
        getState().userState.userData._id
    ).then((res) => {
        dispatch(
            setBoardDataState({
                boardMessages: [res, ...getState().boardState.boardMessages],
            })
        );
        socket.emit("board-message", {
            boardId: getState().boardState.boardData._id,
            message: res,
        });
        return res;
    });
};

export const boardMessageSended = (message) => (dispatch, getState) => {
    dispatch(
        setBoardDataState({
            boardMessages: [message, ...getState().boardState.boardMessages],
        })
    );
};

export const updateBoardTodoListItem = (todoItemData) => (
    dispatch,
    getState
) => {
    updateTodoItem(todoItemData).then((res) => {
        socket.emit("board-update-todos", {
            boardId: getState().boardState.boardData._id,
            userName: getState().userState.userData.name,
        });
    });
};

export const updateBoardUsers = () => (dispatch, getState) => {
    getBoardUsers(getState().boardState.boardData._id).then((user) => {
        dispatch(
            setBoardDataState({
                boardUsersData: user,
            })
        );
    });
};
