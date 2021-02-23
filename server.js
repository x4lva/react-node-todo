const express = require("express")
const config = require("config")

const app = express()

const PORT = config.get('port') || '5000'

app.listen(PORT, () =>  {
    console.log('Server is running on port: ' + PORT)
})