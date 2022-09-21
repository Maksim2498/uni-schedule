import Day    from "./Day.js"
import Lesson from "./Lesson.js"

import * as ed from "./edate.js"

export default class Week {
    static COUNT = 17

    static #number = null

    #beginDate  = null
    #endDate    = null
    #nextLesson = null
    #element    = null

    constructor(config = {}) {
        this.number = config.number ?? 0
        this.days   = [] 

        for (let i = 0; i < 6; ++i) {
            const day    = config.days?.[i] ?? new Day(i)
            day.number   = i
            day.week     = this
            this.days[i] = day
        }
    }

    update() {
        Week.update()
        this.#updateBeginDate()
        this.#updateEndDate()
        this.#updateNextLesson()

        for (const day of this.days)
            day.update()

        this.#updateElement()
    }

    static update() {
        this.#updateNumber()
    }

    static #updateNumber() {
        let day = Day.number

        if (day % 7 === 6)
            day += 1

        const week = day / 7

        this.#number = Math.floor(week)
    }

    #updateBeginDate() {
        this.#beginDate = ed.withDateAdded(Day.FIRST_DATE, 7 * this.number - ed.weekDay(Day.FIRST_DATE))
    }

    #updateEndDate() {
        this.#endDate = ed.withDateAdded(this.#beginDate, 6)
    }

    #updateNextLesson() {
        this.#nextLesson = this.current ? this.#evalNextLesson(this.#nextDay) : undefined
    }

    #evalNextLesson(day, daysDelta = 0) {
        if (day === undefined)
            return undefined

        const lessons = day.lessons

        for (const lesson of day.lessons) {
            const endDate = ed.withTime(lesson.end)

            ed.addDate(endDate, daysDelta)

            if (Date.now() >= endDate || lesson.free)
                continue

            return lesson
        }

        const nextDay = this.days[day.number + 1]

        return this.#evalNextLesson(nextDay, daysDelta + 1)
    }

    get #nextDay() {
        const day = this.today
        return day === undefined ? this.days[0] : day
    }

    #updateElement() {
        this.#element           = document.createElement("table")
        this.#element.className = "week"
        this.#element.caption   = this.#renderCaption()
        this.#element.tHead     = this.#renderTHead()
        this.#element.appendChild(this.#renderTBody())
    }

    #renderCaption() {
        const caption = document.createElement("caption")
        const start   = ed.toShortString(this.beginDate)
        const end     = ed.toShortString(this.endDate)
        caption.innerHTML = `${this.number + 1} неделя (${start} - ${end})`
        return caption
    }

    #renderTHead() {
        const element = document.createElement("thead")

        element.innerHTML = `
            <tr>
                <th>День недели</th>
                <th>№ пары</th>
                <th>Начало</th>
                <th>Конец</th>
                <th>Дисциплина</th>
                <th>Вид занятия</th>
                <th>ФИО преподавателя</th>
                <th>№ аудитории</th>
            </tr>
        `

        return element 
    }

    #renderTBody() {
        const element = document.createElement("tbody")

        for (const day of this.days) 
            for (const dayElement of day.elements)
                element.appendChild(dayElement)

        return element
    }

    get beginDate() {
        if (this.#beginDate === null)
            this.update()

        return new Date(this.#beginDate)
    }

    get endDate() {
        if (this.#endDate === null)
            this.update()

        return new Date(this.#endDate)
    }

    get current() {
        return Week.number === this.number 
    }

    static get number() {
        if (this.#number === null)
            this.update()

        return this.#number
    }

    get today() {
        return this.days[ed.weekDay()]
    }

    get element() {
        if (this.#element === null)
            this.update()

        return this.#element
    }

    get nextLesson() {
        if (this.#nextLesson === null)
            this.update()

        return this.#nextLesson
    }
}
