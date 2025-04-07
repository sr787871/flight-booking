const express = require("express");
const {infoController} = require("../../controllers")
const bookingRoutes = require("./booking-route")
const v1Routes = express.Router();

v1Routes.get('/info',infoController.info)
v1Routes.use('/bookings',bookingRoutes)

module.exports = v1Routes;