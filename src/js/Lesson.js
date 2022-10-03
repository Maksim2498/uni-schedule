import Time from "./Time.js"

import * as ed from "./edate.js"

export default class Lesson {
    static COUNT = 6
    static TIMES = Lesson.#createTimes()

    static #createTimes() {
        const times = [
            [ "9:00", "10:30"],
            ["10:40", "12:10"],
            ["12:40", "14:10"],
            ["14:20", "15:50"],
            ["16:20", "17:50"],
            ["18:00", "19:30"]
        ]

        return times.map(([f, s]) => [Time.fromString(f), Time.fromString(s)])
    }

    static #number = null

    #element = null

    constructor(config = {}) {
        this.subject   = config.subject?.trim()   ?? ""
        this.type      = config.type?.trim()      ?? ""
        this.teacher   = config.teacher?.trim()   ?? ""
        this.classroom = config.classroom?.trim() ?? ""
    }

    update() {
        Lesson.update()
        this.#updateElement()
    }

    static update() {
        this.#updateNumber()
    }

    static #updateNumber() {
        this.#number = this.#evalNumber()
    }

    static #evalNumber() {
        const currentMilli = Time.current.toMillis()

        for (let i = 0; i < this.TIMES.length; ++i) {
            const [, end] = this.TIMES[i]

            if (currentMilli < end)
                return i
        }

        return 7
    }

    get current() {
        return this.number === Lesson.number
    }

    static get number() {
        if (this.#number === null)
            this.update()

        return this.#number
    }

    #updateElement() {
        this.#element           = document.createElement("tr")
        this.#element.className = "lesson"

        if (this.next)
            this.#element.classList.add("next")

        if (this.free)
            this.#element.classList.add("free")

        if ((this.day?.today ?? false) && this.current)
            this.#element.classList.add("current")

        this.#element.innerHTML = `
            ${this.#renderFirst()}
            <td class="number"   >${(this.number ?? 0) + 1     }</td>
            <td class="begin"    >${this.begin.toShortString() }</td>
            <td class="end"      >${this.end.toShortString()   }</td>
            <td class="subject"  >${this.subject               }</td>
            <td class="type"     >${this.type                  }</td>
            <td class="teacher"  >${this.teacher               }</td>
            <td class="classroom">${this.classroom             }</td>
        `
    }

    #renderFirst() {
        if (this.number !== 0)
            return ""

        const day        = this.day
        const beginDate  = day?.week?.beginDate ?? new Date() 
        const today      = day?.today           ?? false
        const className  = renderClassName.call(this)
        const date       = ed.addDate(beginDate, day?.number ?? 0)
        const dateString = ed.toShortString(date)

        return `<td rowspan="6" class="${className}">${day.name}\n(${dateString})</td>`

        function renderClassName() {
            let className = "day-name"

            if (today) 
                className += " today"

            switch (day?.number ?? 0) {
                case 0:
                    className += " monday"
                    break

                case 1:
                    className += " tuesday"
                    break

                case 2:
                    className += " wednesday"
                    break

                case 3:
                    className += " thursday"
                    break

                case 4:
                    className += " friday"
                    break

                case 5:
                    className += " saturday"
                    break
            }

            return className
        }
    }

    get free() {
        return this.subject.trim() === ""
    }

    get begin() {
        return this.range[0]
    }

    get end() {
        return this.range[1]
    }

    get range() {
        return Lesson.TIMES[this.number ?? 0]
    }

    get next() {
        return this.day?.week?.nextLesson === this
    }

    get element() {
        if (this.#element === null)
            this.update()

        return this.#element
    }
}
