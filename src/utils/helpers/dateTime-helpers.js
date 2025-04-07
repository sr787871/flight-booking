function compareTime(StringTime1,StringTime2){
    console.log("he;fksbksf")
    let arrivalTime = new Date(StringTime1);
    let departureTime = new Date(StringTime2);
    console.log(arrivalTime,departureTime)
    return arrivalTime.getTime() > departureTime.getTime() // this will convert the time into miliseconds from 1970 then return T/F
}

module.exports = {
    compareTime,
}