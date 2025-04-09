const cron = require('node-cron')
const {BookingService} = require('../../services')

function scheduleCrons(){
    cron.schedule('*/30 * * * *',async ()=>{ // this cron job runs every 30 minutes
        const response = await BookingService.cancelOldBookings()
    })
}

module.exports = scheduleCrons;