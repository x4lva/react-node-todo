import axios from "axios";

export const createBoardMessage = async (
    boardId,
    messageText,
    messageCreator
) => {
    return await axios
        .post("http://localhost:3000/message/create", {
            boardId,
            messageText,
            messageCreator,
        })
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getBoardMessages = async (boardId) => {
    return await axios
        .post("http://localhost:3000/message/get", { boardId })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};
