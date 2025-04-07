const express = require('express')
const { BookingController } = require('../../controllers')

const Router = express.Router()

Router.post('/',
    BookingController.createBooking
)

module.exports = Router