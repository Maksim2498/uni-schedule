import Time from "./Time.js"

export function withDateAdded(date, n) {
    return addDate(new Date(date), n)
}

export function addDate(date, n) {
    date.setDate(date.getDate() + n)
    return date
}

export function toShortString(date) {
    return `${date.getDate()}.${date.getMonth() + 1}`
}

export function weekDay(date = new Date()) {
    const day = date.getDay() - 1
    return day === -1 ? 6 : day
}

export function withTime(time) {
    return setTime(new Date(), time)
}

export function getDayMillis(date) {
    return Time.fromDate(date).toMillis()
}

export function setTime(date, time) {
    date.setHours(time.hours)
    date.setMinutes(time.minutes)
    date.setSeconds(time.seconds)

    return date
}
