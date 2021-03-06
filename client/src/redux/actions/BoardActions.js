import {UPDATE_BOARD_DATA} from "../types/BoardTypes";
import {getBoardData, getBoardUsers, updateBoardData} from "../../services/BoardService";

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
    })}

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

