import axios from "axios";

export const loginUser = async (userEmail, userPassword) => {
    return await axios
        .post("http://localhost:3000/user/login", { userEmail, userPassword })
        .then((response) => {
            if (response.data.error) {
                return response.data;
            } else {
                localStorage.setItem("usertoken", response.data);
                return response.data;
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

export const registerUser = async (userName, userEmail, userPassword) => {
    return await axios
        .post("http://localhost:3000/user/register", {
            userName,
            userEmail,
            userPassword,
        })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getUserData = async (userId) => {
    return await axios
        .post("http://localhost:3000/user/data ", { userId })
        .then(async (response) => {
            return await response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const updateUsersData = async (userData) => {
    return await axios
        .post("http://localhost:3000/user/update", { userData })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const addUserBoard = async (userId, boardId) => {
    return await axios
        .post("http://localhost:3000/user/update/board", { userId, boardId })
        .then((response) => {
            return { data: response.data, status: response.data.status };
        })
        .catch((err) => {
            console.log(err);
        });
};
export const UserLeaveBoard = async (userId, boardId) => {
    return await axios
        .post("http://localhost:3000/user/leave", { userId, boardId })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            console.log(err);
        });
};

export const userConnectBoard = async (userId, boardId) => {
    return await axios
        .post("http://localhost:3000/user/update/board", {
            userId,
            boardId,
        })
        .then((response) => {
            console.log(response);
            return response;
        })
        .catch((err) => {
            console.log(err);
        });
};
