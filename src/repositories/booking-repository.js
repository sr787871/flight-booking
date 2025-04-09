const CrudRepository = require("./crud-repository");
const AppError = require('../utils/errors/app-error')
const { StatusCodes } = require('http-status-codes')
const {Booking} = require('../models')
const {Op} = require('sequelize')
const {Enums} = require("../utils/common")
const {BOOKED,CANCELLED} = Enums.BOOKING_STATUS

class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking)
    }
    
    async createBooking(data,transaction){
        const response = await Booking.create(data,{transaction:transaction});
        return response;
    }

    async get(data,transaction){
        const response = await this.model.findByPk(data,{transaction:transaction});
        if(!response){
            throw new AppError("Not able to find the resource",StatusCodes.NOT_FOUND)
        }
        return response;
    }

    async update(id,data,transaction){ // data is given in the form of object { col : val,....}
        const response = await Booking.update(data,{
            where : {
                id : id
            }
        },{transaction:transaction});
        if(!response[0]){
            throw new AppError("Not able to find the resource",StatusCodes.NOT_FOUND)
        }
        return response;
    }

    async cancelOldBookings(timestamp){
        const response = await Booking.update({status : CANCELLED},{
            where: {
                [Op.and] : [
                    {createdAt : {
                        [Op.lt] : timestamp
                    }},
                    {
                        status : {
                            [Op.ne] : BOOKED
                        }
                    },
                    {
                        status : {
                            [Op.ne] : CANCELLED
                        }
                    }
                ]
            }
        }) // time 5 mins ago
        return response
    }
}

module.exports = BookingRepository