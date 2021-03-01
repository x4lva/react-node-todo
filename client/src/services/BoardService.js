import axios from "axios";

export const createBoard = async (boardName, userId) => {
    return await axios
        .post("http://localhost:3000/board/create", {boardName, userId})
        .then(response => {
            console.log(response.data.status)
        })
        .catch(e => {
            console.log(e)
        })
}

export const getBoardList = async () => {
    return await axios
        .post("http://localhost:3000/board/list", {})
        .then(response => {
            return response.data
        })
        .catch(e => {
            console.log(e)
        })
}

export const getBoardData = async (boardId) => {
    return await axios
        .get(`http://localhost:3000/board/data/${boardId}`)
        .then(response => {
            return response.data
        })
        .catch(e => {
            console.log(e)
        })
}

export const addBoardMember = async (boardId, userId) => {
    return await axios
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