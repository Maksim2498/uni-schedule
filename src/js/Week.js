import Day from "./Day.js"

import * as c  from "./consts.js"
import * as ed from "./edate.js"

export default class Week {
    constructor(config = {}) {
        this.number = config.number ?? 0
        this.days   = [] 

        for (let i = 0; i < 6; ++i) {
            const day    = config.days?.[i] ?? new Day(i)
            day.number   = i
            this.days[i] = day
        }
    }

    get startDate() {
        return ed.withDateAdded(c.FIRST_DAY, 7 * this.number - c.FIRST_DAY.getDay() + 1)
    }

    get endDate() {
        return ed.addDate(this.startDate, 6)
    }

    get even() {
        return this.number % 2 == 0
    }

    get current() {
        return Week.currentNumber === this.number 
    }

    static get currentNumber() {
        const day = Day.currentNumber

        if (day % 7 === 6)
            day += 1

        const week = day / 7

        return Math.floor(week)
    }

    get today() {
        return this.days[new Date().getDay() - 1]
    }

    render() {
        const tableElement   = document.createElement("table")
        tableElement.caption = this.#renderCaption()

        const tBodyElement = tableElement.createTBody()
        tBodyElement.appendChild(this.#renderHeaders())

        const nextClass   = this.#nextClass()
        const todayNumber = Day.todayNumber 
        const current     = this.current

        for (let i = 0; i < 6; ++i) {
            const day             = this.days[i]
            const today           = current && todayNumber === i
            const nextClassNumber = current && nextClass.day === day ? nextClass.number : -1
            this.#renderDay({ tBodyElement, day, today, nextClassNumber })
        }

        return tableElement
    }

    #renderCaption() {
        const caption = document.createElement("caption")
        const start   = ed.toShortString(this.startDate)
        const end     = ed.toShortString(this.endDate)
        caption.innerHTML = `${this.number + 1} неделя (${start} - ${end})`
        return caption
    }

    #renderHeaders() {
        const headers = document.createElement("tr")

        headers.innerHTML = `
            <th>День недели</th>
            <th>% пары</th>
            <th>Начало</th>
            <th>Конец</th>
            <th>Дисциплина</th>
            <th>Вид занятия</th>
            <th>ФИО преподавателя</th>
            <th>№ аудитории</th>
        `

        return headers
    }

    #renderDay(config) {
        const { tBodyElement, day, today, nextClassNumber } = config

        for (let classNumber = 0; classNumber < 6; ++classNumber) {
            const next         = classNumber === nextClassNumber 
            const classElement = this.#renderClass({day, classNumber, next, today})
            tBodyElement.appendChild(classElement)
        }
    }

    #nextClass(day = this.today, daysDelta = 0) {
        const classes = day.classes 

        for (let i = 0; i < 6; ++i) {
            var [, end] = c.CLASS_TIME[i]

            end = timeStringToDate(end, daysDelta)
            
            if (Date.now() >= end || classes[i].subject === "")
                continue

            return { number: i, day } 
        }

        const nextDay = this.days[day.number >= 5 ? 0 : day.number + 1]

        return this.#nextClass(nextDay, daysDelta + 1)

        function timeStringToDate(time, addDays) {
            var [h, m] = time.split(":")

            h = Number(h)
            m = Number(m)

            const now = new Date()
            ed.addDate(now, addDays)
            now.setHours(h)
            now.setMinutes(m)

            return now
        }
    }

    #renderClass(config) {
        const { day, classNumber, next, today     } = config
        const { subject, type, teacher, classroom } = day.classes[classNumber]
        const [start, end]                          = c.CLASS_TIME[classNumber]
        const classElement                          = document.createElement("tr")

        if (next) 
            classElement.className = "next"

        var first = ""

        if (classNumber == 0) {
            const date = ed.addDate(this.startDate, day.number)
            first = `<td rowspan=6 ${today ? 'class="today"' : ""}>${day.name}<br>(${ed.toShortString(date)})</td>`
        }

        classElement.innerHTML = `
            ${first}
            <td>${classNumber + 1}</td>
            <td>${start}</td>
            <td>${end}</td>
            <td>${subject}</td>
            <td>${type}</td>
            <td>${teacher}</td>
            <td>${classroom}</td>
        `

        return classElement
    }
}
