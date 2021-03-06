import {UPDATE_USER_DATA} from "../types/UserTypes";
import jwtDecode from "jwt-decode";
import {getUserData} from "../../services/UserService";
import store from "../store";
import {setUserDataState} from "../actions/UserActions";


const userInitData = async () => {
    const userId = localStorage.usertoken !== undefined ? jwtDecode(localStorage.usertoken)._id : ""

    await getUserData(userId).then(res => {
        store.dispatch(setUserDataState(res))
    })
}

const initialState = {
    userData: {
        _id: '',
        name: '',
        email: '',
        password: '',
        boards: []
    }
}

const userReducer = (state = initialState, action) => {
    switch (action.type){
        case UPDATE_USER_DATA:
            return {...state, ...action.payload}
        default:
            return state
    }
}

userInitData()

export default userReducer