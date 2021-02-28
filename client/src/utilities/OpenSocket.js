import openSocket from "socket.io-client"

const socket = openSocket.io('http://localhost:5000', {transports: ["websocket"] })

export default socket