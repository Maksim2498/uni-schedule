import * as ed from "./edate.js"

export default class Lesson {
    static COUNT = 6
    static TIMES = [
        [ "9:00", "10:30"],
        ["10:40", "12:10"],
        ["12:40", "14:10"],
        ["14:20", "15:50"],
        ["16:20", "17:50"],
        ["18:00", "19:30"]
    ]

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
        // Added symentry sake
    }

    #updateElement() {
        this.#element           = document.createElement("tr")
        this.#element.className = "lesson"

        if (this.next)
            this.#element.classList.add("next")

        if (this.free)
            this.#element.classList.add("free")

        this.#element.innerHTML = `
            ${this.#renderFirst()}
            <td class="number"   >${(this.number ?? 0) + 1}</td>
            <td class="begin"    >${this.begin            }</td>
            <td class="end"      >${this.end              }</td>
            <td class="subject"  >${this.subject          }</td>
            <td class="type"     >${this.type             }</td>
            <td class="teacher"  >${this.teacher          }</td>
            <td class="classroom">${this.classroom        }</td>
        `
    }

    #renderFirst() {
        if (this.number !== 0)
            return ""

        const day        = this.day
        const beginDate  = day?.week?.beginDate ?? new Date() 
        const today      = day?.today           ?? false
        const className  = renderClassName()
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
