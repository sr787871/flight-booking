const axios = require('axios')
const db = require('../models')
const {BookingRepository} = require('../repositories')
const {serverConfig} = require("../config")
const AppError = require('../utils/errors/app-error')
const { StatusCodes } = require('http-status-codes')
const {Enums} = require("../utils/common")
const {BOOKED,CANCELLED} = Enums.BOOKING_STATUS

const bookingRepository = new BookingRepository()

async function createBooking(data){
    // Managed Transaction where the rollback and commit will happens automatically
    // try {
    //     const result = await db.sequelize.transaction(async function bookingImp(t){
    //         const flight = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`)
    //         console.log(flight.data)
    //         const flightData = flight.data.data
    //         console.log(data)
    //         if(data.noOfSeats > flightData.totalSeats){
    //             throw new AppError("Not Enough Seats Available",StatusCodes.BAD_REQUEST)
    //         }
    //         return true
    //     })
    // } catch (error) {
    //     throw error
    // }

    // UnManaged Transaction where we have to do manually commit the transaction or rollback the transaction
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`)
        console.log(flight.data)
        const flightData = flight.data.data
        console.log(data)
        if(data.noOfSeats > flightData.totalSeats){
            throw new AppError("Not Enough Seats Available",StatusCodes.BAD_REQUEST)
        }
        const totalBillingAmt = data.noOfSeats * flightData.price
        console.log(totalBillingAmt)
        const bookingPayload = {...data,totalCost : totalBillingAmt}
        const booking = await bookingRepository.createBooking(bookingPayload,transaction)
        
        //calling the updatedSeats api for booking
        await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{
            seats : data.noOfSeats
        })
        await transaction.commit()
        return booking
    } catch (error) {
        await transaction.rollback()  
        // console.log(error)
        throw error
        // throw new AppError("something went wrong",StatusCodes.INTERNAL_SERVER_ERROR)     
    }
}

async function makePayment(data){
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId,transaction)
        if(bookingDetails.status == CANCELLED){
            throw new AppError("The booking has expired",StatusCodes.BAD_REQUEST)
        }
        const bookingTime = new Date(bookingDetails.createdAt)
        const currentTime = new Date()
        if(currentTime - bookingTime > 300000){
            
            await bookingRepository.update(data.bookingId,{status:CANCELLED},transaction);
            throw new AppError("The booking has expired",StatusCodes.BAD_REQUEST)
        }
        if(bookingDetails.totalCost != data.totalCost){
            throw new AppError("The amount of the payment doesn't match",StatusCodes.BAD_REQUEST)
        }
        if(bookingDetails.userId != data.userId){
            throw new AppError("The user corresponding to the booking doesn't match",StatusCodes.BAD_REQUEST)
        }
        // we assume here payment is successful
        await bookingRepository.update(data.bookingId,{status:BOOKED},transaction);
        await transaction.commit()
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        throw error
    }
}

module.exports = {
    createBooking,
    makePayment
}