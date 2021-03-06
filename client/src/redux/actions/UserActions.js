import {UPDATE_USER_DATA} from "../types/UserTypes";
import {getUserData, updateUsersData} from "../../services/UserService";
import store from "../store";

export const updateUserData = (payload) => {
    return {
        type: UPDATE_USER_DATA,
        payload
    }
}

export const setUserDataState = (userId) => (dispatch, getState) => {
    getUserData(userId).then(userData => {
        dispatch(updateUserData({
            userData: {...userData}
        }))
    })
}

export const updateUserDataState = (updatedUserData, userId) => (dispatch, getState) => {
    updateUsersData({...updatedUserData, _id: userId}).then(userData => {
        dispatch(updateUserData({
            userData: {...userData}
        }))
    })
}