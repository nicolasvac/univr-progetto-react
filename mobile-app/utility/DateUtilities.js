import moment from "moment";

export const dateToMomentYYYYMMDD = (date, utc) => {
    let readableDate = moment(date).format('YYYY-MM-DD')
    return readableDate
}

export const dateToMomentYYYYMMDDHHMM = (date, utc) => {
    let readableDate = moment(date).format('YYYY-MM-DD HH:mm')
    return readableDate
}

export const dateToMomentYYYYMMDDHHMMSS = (date, utc) => {
    let readableDate = moment(date).format('YYYY-MM-DD HH:mm:ss')
    return readableDate
}





