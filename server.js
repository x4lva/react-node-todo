const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const cors = require("cors")
const http = require('http')
const bodyParser = require("body-parser")
const socketIo = require("socket.io");

mongoose.connect("mongodb+srv://x4lva:dimonchak@cluster0.lyxpu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.set("useFindAndModify", false)

const PORT = config.get('port') || '5000'
const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)
const server = http.createServer(app)

const io = socketIo(server);

server.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT)
})

app.use("/board", require("./routes/Board"))
app.use("/user", require("./routes/User"))