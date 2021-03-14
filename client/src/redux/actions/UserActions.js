import { UPDATE_USER_DATA } from "../types/UserTypes";
import {
    getUserData,
    updateUsersData,
    userConnectBoard,
    UserLeaveBoard,
} from "../../services/UserService";
import { createNewBoard } from "../../services/BoardService";
import { ToastsStore } from "react-toasts";
import socket from "../../utilities/OpenSocket";

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
    createNewBoard(boardName, getState().userState.userData._id).then((res) => {
        dispatch(
            updateUserData({
                userData: {
                    ...getState().userState.userData,
                    boards: [...getState().userState.userData.boards, res._id],
                },
            })
        );
    });
};

export const leaveBoard = (boardId) => (dispatch, getState) => {
    UserLeaveBoard(getState().userState.userData._id, boardId);

    const currentBoards = getState().userState.userData.boards;
    currentBoards.filter((el) => el !== boardId);

    dispatch(
        updateUserData({
            userData: {
                ...getState().userState.userData,
                boards: [...currentBoards],
            },
        })
    );
    socket.emit("board-user", getState().boardState.boardData._id);
    window.location.reload();
};

export const connectBoardIdChange = (boardId) => (dispatch, getState) => {
    dispatch(
        updateUserData({
            userConnectBoardId: boardId,
        })
    );
};

export const connectBoard = () => (dispatch, getState) => {
    userConnectBoard(
        getState().userState.userData._id,
        getState().userState.userConnectBoardId
    ).then((res) => {
        console.log(res);
        if (res.data.status === 200) {
            dispatch(
                updateUserData({
                    userData: {
                        ...getState().userState.userData,
                        boards: [
                            ...getState().userState.userData.boards,
                            res.data.boardId,
                        ],
                    },
                })
            );
            socket.emit("board-user", getState().boardState.boardData._id);
        } else {
            ToastsStore.error("Wrong board id");
        }
    });
};
