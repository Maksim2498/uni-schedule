import Day from "./Day.js"

import * as c from "./consts.js"

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
        return dateAfterNDays(c.FIRST_DAY, 7 * this.number)
    }

    get endDate() {
        return dateAfterNDays(this.startDate, 6)
    }

    get even() {
        return number % 2 == 0
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
        return this.days[c.TODAY.getDay() - 1]
    }

    render() {
        const tableElement = document.createElement("table")

        tableElement.className = "week"
        tableElement.caption   = this.#renderCaption()
        tableElement.appendChild(this.#renderHeaders())

        const nextClass   = this.#nextClass()
        const todayNumber = Day.todayNumber 
        const current     = this.current

        for (let i = 0; i < 6; ++i) {
            const day             = this.days[i]
            const today           = current && todayNumber === i
            const nextClassNumber = current && nextClass.day === day ? nextClass.number : -1
            this.#renderDay({ tableElement, day, today, nextClassNumber })
        }

        return tableElement
    }

    #renderCaption() {
        const caption = document.createElement("caption")
        const start   = this.#dateToString(this.startDate)
        const end     = this.#dateToString(this.endDate)
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
        const { tableElement, day, today, nextClassNumber } = config

        for (let classNumber = 0; classNumber < 6; ++classNumber) {
            const next         = classNumber === nextClassNumber 
            const classElement = this.#renderClass({day, classNumber, next, today})
            tableElement.appendChild(classElement)
        }
    }

    #nextClass(day = this.today) {
        const classes = day.classes 

        for (let i = 0; i < 6; ++i) {
            var [, end] = c.CLASS_TIME[i]

            end = timeStringToDate(end)
            
            if (Date.now() >= end || classes[i].subject === "")
                continue

            return { number: i, day } 
        }

        const nextDay = this.days[day.number >= 5 ? 0 : day.number + 1]

        return this.#nextClass(nextDay)

        function timeStringToDate(time) {
            var [h, m] = time.split(":")

            h = Number(h)
            m = Number(m)

            const now = new Date()
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

        if (classNumber == 0) 
            first = `<td rowspan=6 ${today ? 'class="today"' : ""}>${day.name}</td>`

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

    #dateToString(date) {
        return `${date.getMonth() + 1}.${date.getDate()}`
    }
}

function dateAfterNDays(date, n) {
    const next = new Date(date)
    next.setDate(next.getDate() + n)
    return next
}