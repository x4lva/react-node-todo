import {UPDATE_BOARD_DATA} from "../types/BoardTypes";
import {getBoardData, getBoardUsers, updateBoardData} from "../../services/BoardService";
import {addUserBoard} from "../../services/UserService";
import { ToastsStore } from 'react-toasts';
import {createTodo, deleteTodo, getBoardTodos, updateTodo} from "../../services/TodoService";
import {createTodoItem, deleteTodosItem, getTodoItemsList, updateTodoItem} from "../../services/TodoItemService";

export const setBoardDataState = (payload) => {
    return {
        type: UPDATE_BOARD_DATA,
        payload
    }
}

export const getBoardState = (boardId) => async (dispatch, getState) => {
    getBoardData(boardId).then(board => {
        dispatch(setBoardDataState({
            boardData: {...board}
        }))
    })

    getBoardUsers(boardId).then(user => {
        dispatch(setBoardDataState({
            boardUsersData: user
        }))
    })

    getBoardTodos(boardId).then(todos => {
        dispatch(setBoardDataState({
            boardTodoLists: todos
        }))
    })
    dispatch(setBoardDataState({
        boardTodoListItems: []
    }))
}

export const updateBoardDataState = (boardData) => (dispatch, getState) => {
    updateBoardData({...boardData, _id: getState().boardState.boardData._id}).then(board => {
        if (board.status === 200){
            dispatch(setBoardDataState({
                boardData: {...board.data}
            }))
            getBoardUsers(getState().boardState.boardData._id).then(user => {
                dispatch(setBoardDataState({
                    boardUsersData: user
                }))
            })
        }
    })
}

export const addMemberToBoard = (userId, boardId) => (dispatch, getState) => {
    addUserBoard(userId, boardId).then(response => {
        if (response.status === 200){
            dispatch(setBoardDataState({
                boardData: {...response.data.board}
            }))
            getBoardUsers(boardId).then(user => {
                dispatch(setBoardDataState({
                    boardUsersData: user
                }))
            })
            ToastsStore.success("User has been created")
        }else{
            ToastsStore.error(response.data.message)
        }
    })
}

export const toggleBoardAddMember = () => (dispatch, getState) => {
    dispatch(setBoardDataState({
        boardAddMember: !getState().boardState.boardAddMember
    }))
}

export const changeBoardAddMemberId = (memberId) => (dispatch, getState) => {
    dispatch(setBoardDataState({
        boardAddMemberId: memberId
    }))
}

export const toggleAddBoardTodo = (state) => (dispatch, getState) => {
    dispatch(setBoardDataState({
        boardTodoCreate: state
    }))
}

export const changeBoardAddTodo = (todoName) => (dispatch, getState) => {
    dispatch(setBoardDataState({
        boardTodoCreateName: todoName
    }))
}

export const boardCreateTodoList = () => (dispatch, getState) => {
    if (getState().boardState.boardTodoCreateName !== ''){
        createTodo(getState().boardState.boardTodoCreateName, getState().boardState.boardData._id, getState().userState.userData._id)
            .then(res => {
                getBoardTodos(getState().boardState.boardData._id).then(todos => {
                    dispatch(setBoardDataState({
                        boardTodoLists: todos
                    }))
                    ToastsStore.success("Todo list has been created successfully")
                })
            })
        dispatch(setBoardDataState({
            boardTodoCreateName: ''
        }))
    }else{
        ToastsStore.error("Todo list name can not be empty")
    }
}

export const deleteTodoBoard = (todoListId) => (dispatch, getState) => {
    deleteTodo(todoListId).then(res => {
        ToastsStore.success("Todo list has been deleted")
    })
}

export const updateTodoList = (todoData, todoId) => (dispatch, getState) =>  {
    updateTodo(todoData, todoId).then(res => {
        console.log(todoData)
        getBoardTodos(getState().boardState.boardData._id).then(todos => {
            dispatch(setBoardDataState({
                boardTodoLists: todos
            }))
        })
    })
}

export const createTodoListItem = (todoId,todoItemName) => (dispatch, getState) =>  {
    if (todoItemName !== ''){
        createTodoItem(todoId, getState().userState.userData._id, todoItemName)
            .then(res => {
                const newItem = [...getState().boardState.boardTodoListItems, {todoId: todoId, todoItems: [res]}].filter(el => el.todoId === todoId).map(el => {
                    return el.todoItems
                })

                const lastItem = newItem.flat()

                const idx = [...getState().boardState.boardTodoListItems].findIndex(el => el.todoId === todoId)

                const before = [...getState().boardState.boardTodoListItems].splice(0, idx)
                const after = [...getState().boardState.boardTodoListItems].splice(idx+1)

                const result = [
                    ...before,
                    {todoId: todoId, todoItems: lastItem},
                    ...after
                ]

                dispatch(setBoardDataState({
                    boardTodoListItems: result
                }))
                ToastsStore.success("Todo list item hes been created successfully")
            })
    }else {
        ToastsStore.error("Todo list item name can not be empty")
    }
}

export const getTodoListItems = (todoId) => async (dispatch, getState) => {
    await getTodoItemsList(todoId)
        .then(async res => {
            dispatch(setBoardDataState({
                boardTodoListItems: {todoId: todoId, todoItems: res}
            }))
        })
}

export const reorderCurrentTodoListItems = (todoListId, sourceIndex, destIndex) => async (dispatch, getState) => {

    const todoItemsList = [...getState().boardState.boardTodoListItems]
    const idx = [...todoItemsList].findIndex(el => el.todoId === todoListId)


    const currentTodoList = [...todoItemsList].find(el => el.todoId === todoListId)
    const source = currentTodoList.todoItems[sourceIndex]

    currentTodoList.todoItems.splice(sourceIndex, 1)
    currentTodoList.todoItems.splice(destIndex, 0, source)

    const before = [...todoItemsList].splice(0, idx)
    const after = [...todoItemsList].splice(idx+1)

    currentTodoList.todoItems.forEach((el, index) => {
        updateTodoItem({_id: el._id, order: index})
        el.order = index
    })

    const result = [
        ...before,
        currentTodoList,
        ...after
    ]

    console.log(result)

    dispatch(setBoardDataState({
        boardTodoListItems: result
    }))
}


export const moveTodoItemToList = (fromTodoId, toTodoId, sourceIndex, destIndex) => (dispatch, getState) => {
    const todoItemsList = [...getState().boardState.boardTodoListItems]

    const current = [...todoItemsList].find(el => el.todoId === fromTodoId)

    const before = current.splice(0, sourceIndex)
    const after = current.splice(sourceIndex+1)

    const result = [
        ...before,
        ...after
    ]

    dispatch(setBoardDataState({
        boardTodoListItems: result
    }))
}

export const deleteTodoItem = (todoItemId) => (dispatch, getState) => {
    deleteTodosItem(todoItemId)
    ToastsStore.success("Todo list item hes been deleted successfully")
}