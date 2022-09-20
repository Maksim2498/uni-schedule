import Lesson from "./Lesson.js"

import * as ed from "./edate.js"

export default class Day {
    static FIRST_DATE = new Date("September 1, 2022")
    static NAMES      = [
        "Понедельник", 
        "Вторник",
        "Среда", 
        "Чертверг", 
        "Пятница", 
        "Суббота", 
        "Воскресенье"
    ]

    static #number = null

    #today    = null
    #elements = null

    constructor(lessons = []) {
        this.lessons = []

        for (let i = 0; i < Lesson.COUNT; ++i) {
            const lesson    = lessons[i] ?? new Lesson()
            lesson.number   = i
            lesson.day      = this
            this.lessons[i] = lesson 
        }
    }

    update() {
        Day.update()
        this.#updateToday()

        for (const lesson of this.lessons)
            lesson.update()

        this.#updateElements()
    }

    static update() {
        Lesson.update()
        this.#updateNumber()
    }

    static #updateNumber() {
        this.#number = this.dateNumber(Date.now())
    }

    #updateToday() {
        const date = this.week?.beginDate ?? new Date()
        ed.addDate(date, this.number ?? 0)
        this.#today = Day.dateNumber(date) === Day.number
    }

    #updateElements() {
        this.#elements = []

        for (const lesson of this.lessons)
            this.#elements.push(lesson.element)
    }

    get name() {
        return Day.NAMES[this.number ?? 0]
    }

    get today() {
        if (this.#today === null)
            this.update()

        return this.#today
    }

    get elements() {
        if (this.#elements === null)
            this.update()

        return this.#elements
    }

    static get number() {
        if (this.#number === null)
            this.update()

        return this.#number
    }

    static dateNumber(date) {
        const difference = date - this.FIRST_DATE
        const second     = difference / 1000
        const minute     = second     / 60
        const hour       = minute     / 60
        const day        = hour       / 24 + ed.weekDay(this.FIRST_DATE)

        return Math.floor(day)
    }

    get free() {
        return this.lessons.every(l => l.free)
    }
}
