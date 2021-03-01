import axios from "axios";

export const loginUser = async (userEmail, userPassword) => {
    return await axios
        .post("http://localhost:3000/user/login", {userEmail, userPassword})
        .then(response => {
            if (response.data.error){
                return response.data
            }else{
                localStorage.setItem('usertoken', response.data)
                return response.data
            }
        })
        .catch(err => {
            console.log(err)
        })
}

export const registerUser = async (userName, userEmail, userPassword) => {
    return await axios
        .post("http://localhost:3000/user/register", {userName, userEmail, userPassword})
        .then(response => {
            if (response.data.error){
                return response.data
            }else{
                return response.data
            }
        })
        .catch(err => {
            console.log(err)
        })
}

export const connectBoard = async (userId, boardId) => {
    return await axios
        .post("http://localhost:3000/user/connect", {userId, boardId})
        .then(response => {
            console.log(response.data)
        })
        .catch(err => {
            console.log(err)
        })
}

export const getUserData = async (userId) => {
    return await axios
        .post("http://localhost:3000/user/data ", {userId})
        .then(response => {
           return response.data
        })
        .catch(err => {
            console.log(err)
        })
}