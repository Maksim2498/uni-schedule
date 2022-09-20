export default class Time {
    static get current() {
        return this.fromDate(new Date)
    }

    static fromDate(date) {
        return new Time(date.getHours(), date.getMinutes(), date.getSeconds())
    }

    static fromString(str) {
        let [hours, minutes, seconds] = str.split(":")

        hours   = Number(hours   ?? 0)
        minutes = Number(minutes ?? 0)
        seconds = Number(seconds ?? 0)

        return new Time(hours, minutes, seconds)
    }

    constructor(hours = 0, minutes = 0, seconds = 0) {
        this.hours   = hours
        this.minutes = minutes
        this.seconds = seconds
    }

    toMillis() {
        return 60 * 60 * 1_000 * this.hours
                  + 60 * 1_000 * this.minutes
                       + 1_000 * this.seconds
    }

    toShortString() {
        return `${this.hoursToString()}:${this.minutesToString()}`
    }

    toString() {
        return `${this.hoursToString()}:${this.minutesToString()}:${this.secondsToString()}`
    }

    hoursToString() {
        return String(this.hours)
    }

    minutesToString() {
        return String(this.minutes).padStart(2, 0)
    }

    secondsToString() {
        return String(this.seconds).padStart(2, 0)
    }
    
    valueOf() {
        return this.toMillis()
    }
}
