import { UPDATE_USER_DATA } from "../types/UserTypes";
import {
    getUserData,
    updateUsersData,
    UserLeaveBoard,
} from "../../services/UserService";
import { createNewBoard } from "../../services/BoardService";

export const updateUserData = (payload) => {
    return {
        type: UPDATE_USER_DATA,
        payload,
    };
};

export const setUserDataState = (userId) => (dispatch, getState) => {
    getUserData(userId).then((userData) => {
        dispatch(
            updateUserData({
                userData: { ...userData },
            })
        );
    });
};

export const updateUserDataState = (updatedUserData, userId) => (
    dispatch,
    getState
) => {
    updateUsersData({ ...updatedUserData, _id: userId }).then((userData) => {
        dispatch(
            updateUserData({
                userData: { ...userData },
            })
        );
    });
};

export const createBoard = (boardName) => (dispatch, getState) => {
    createNewBoard(boardName, getState().userState.userData._id);
};

export const leaveBoard = (boardId) => (dispatch, getState) => {
    UserLeaveBoard(getState().userState.userData._id, boardId);

    const currentBoards = getState().userState.userData.boards;
    currentBoards.filter((el) => el !== boardId);

    dispatch(
        setUserDataState({
            userData: {
                ...getState().userState.userData,
                boards: [...currentBoards],
            },
        })
    );
    window.location.reload();
};
