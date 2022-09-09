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

export function setTime(date, time) {
    const { hours, minutes, seconds } = parseTime(time)

    date.setHours(hours)
    date.setMinutes(minutes)
    date.setSeconds(seconds)

    return date
}

export function timeToMillis(time) {
    const { hours, minutes, seconds } = parseTime(time)
    return hours * 60 * 60 * 1000 
            + minutes * 60 * 1000
                 + seconds * 1000
}

export function parseTime(time) {
    let [hours, minutes, seconds] = time.split(":")

    hours   = hours   === undefined ? 0 : Number(hours)
    minutes = minutes === undefined ? 0 : Number(minutes)
    seconds = seconds === undefined ? 0 : Number(seconds)

    return { hours, minutes, seconds }
}

export function millis(date = new Date()) {
    return date.getHours() * 60 * 60 * 1000 
            + date.getMinutes() * 60 * 1000
                 + date.getSeconds() * 1000
                   + date.getMilliseconds()
}
