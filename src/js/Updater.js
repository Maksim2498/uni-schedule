import Lesson from "./Lesson.js"
import Week   from "./Week.js"

import * as ed from "./edate.js"

export default class Updater {
    static AUTO_UPDATE_INTERVAL = 1_000

    #interval
    #oldWeekNumber   = Week.number
    #oldLessonNumber = Lesson.number

    constructor(config) {
        this.currentWeek = config.currentWeek
        this.weeks       = config.weeks
        this.autoUpdate  = true
    }

    get autoUpdate() {
        return this.#interval !== undefined
    }

    set autoUpdate(val) {
        if (this.autoUpdate === val)
            return

        if (val)
            this.#interval = setInterval(() => this.updateIfNeeded(), Updater.AUTO_UPDATE_INTERVAL)
        else {
            clearInterval(this.#interval)
            this.#interval = undefined
        }
    }

    updateIfNeeded() {
        if (this.needUpdate)
            this.update()
    }

    get needUpdate() {
        return this.weekNumberChanged || this.lessonNumberChanged
    }

    get weekNumberChanged() {
        Week.update()
        const res = this.#oldWeekNumber !== Week.number
        this.#oldWeekNumber = Week.number
        return res
    }

    get lessonNumberChanged() {
        Lesson.update()
        const res = this.#oldLessonNumber !== Lesson.number
        this.#oldLessonNumber = Lesson.number
        return res
    }

    update() {
        this.currentWeek?.rerender()
        this.weeks?.update()
        this.weeks?.rerender()
    }
}
