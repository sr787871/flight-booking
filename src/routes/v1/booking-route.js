const express = require('express')
const { BookingController } = require('../../controllers')
const {BookingMiddleware} = require("../../middlewares")
const Router = express.Router()

Router.post('/',
    BookingMiddleware.validateBookingRequest,
    BookingController.createBooking
)

Router.post('/payment',
    BookingMiddleware.validateMakePayment,
    BookingController.makePayment
)

module.exports = Router