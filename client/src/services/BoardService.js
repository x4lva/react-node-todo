import axios from "axios";

export const createBoard = (boardName, userId) => {
    return axios
        .post("http://localhost:3000/board/create", {boardName, userId})
        .then(response => {
            console.log(response.data.status)
        })
        .catch(e => {
            console.log(e)
        })
}

export const getBoardList = () => {
    return axios
        .post("http://localhost:3000/board/list", {})
        .then(response => {
            return response.data
        })
        .catch(e => {
            console.log(e)
        })
}

export const getBoardData = (boardId) => {
    return axios
        .get(`http://localhost:3000/board/data/${boardId}`)
        .then(response => {
            return response.data
        })
        .catch(e => {
            console.log(e)
        })
}

export const addBoardMember = (boardId, userId) => {
    return axios
        .post("http://localhost:3000/board/add/member", {boardId, userId})
        .then(response => {
            if (response.data.status){
                return response.data
            }else{
                console.log(response.data)
            }
        })
        .catch(e => {
            console.log(e)
        })
}