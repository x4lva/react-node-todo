import {UPDATE_BOARD_DATA} from "../types/BoardTypes";


const initialState = {
    boardData: {
        _id: '',
        name: '',
        users: []
    },
    boardUsersData: [],
    boardAddMember: false,
    boardAddMemberId: '',
    boardTodoCreate: false,
    boardTodoCreateName: '',
    boardTodoLists: [],
    boardTodoListItems: []
}

const boardReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_BOARD_DATA:
            return {...state, ...action.payload}
        default:
            return state
    }
}

export default boardReducer
