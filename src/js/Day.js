import * as c from "./consts.js"

export default class Day {
    constructor(classes = []) {
        this.classes = []

        for (let i = 0; i < 6; ++i)
            this.classes[i] = {
                subject:   classes?.[i]?.subject   ?? "",
                type:      classes?.[i]?.type      ?? "",
                teacher:   classes?.[i]?.teacher   ?? "",
                classroom: classes?.[i]?.classroom ?? ""
            }
    }

    get name() {
        return c.DAY_NAMES[this.number ?? 7]
    }

    get currentNumber() {
        return (this.number ?? -1) === Day.currentNumber
    }

    static get currentNumber() {
        const difference = c.TODAY - c.FIRST_DAY
        const second     = difference / 1000
        const minute     = second     / 60
        const hour       = minute     / 60
        const day        = hour       / 24 + c.FIRST_DAY.getDay() - 1

        return day
    }

    static get todayNumber() {
        let number = c.TODAY.getDay() - 1
        return number === -1 ? 6 : number
    }
}
