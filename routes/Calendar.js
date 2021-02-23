const express = require('express')
const cors = require('cors')

const calendar = express.Router()

calendar.use(cors())

calendar.get('/calendar:id', (req, res) => {

})
