const {StatusCodes} = require("http-status-codes");

const {ErrorResponse} = require("../utils/common");
const AppError = require("../utils/errors/app-error");

function validateBookingRequest(req, res, next){
    if(!req.body.flightId){
        ErrorResponse.message = "Something went wrong while creating booking";
        ErrorResponse.error = new AppError(['flightId not found in the incoming request in the correct form'],StatusCodes.BAD_REQUEST) 
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }
    if(!req.body.userId){
        ErrorResponse.message = "Something went wrong while creating booking";
        ErrorResponse.error = new AppError(['userId not found in the incoming request in the correct form'],StatusCodes.BAD_REQUEST) 
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }
    if(!req.body.noOfSeats){
        ErrorResponse.message = "Something went wrong while creating booking";
        ErrorResponse.error = new AppError(['noOfSeats not found in the incoming request in the correct form'],StatusCodes.BAD_REQUEST) 
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }
    next();
}

function validateMakePayment(req, res, next){
    if(!req.body.totalCost){
        ErrorResponse.message = "Something went wrong while creating booking";
        ErrorResponse.error = new AppError(['totalCost not found in the incoming request in the correct form'],StatusCodes.BAD_REQUEST) 
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }
    if(!req.body.userId){
        ErrorResponse.message = "Something went wrong while creating booking";
        ErrorResponse.error = new AppError(['userId not found in the incoming request in the correct form'],StatusCodes.BAD_REQUEST) 
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }
    if(!req.body.bookingId){
        ErrorResponse.message = "Something went wrong while creating booking";
        ErrorResponse.error = new AppError(['bookingId not found in the incoming request in the correct form'],StatusCodes.BAD_REQUEST) 
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }
    next();
}
module.exports = {
    validateBookingRequest,
    validateMakePayment
}