import Day          from "./Day.js"
import Lesson       from "./Lesson.js"
import schedule     from "./schedule.js"
import Week         from "./Week.js"
import WeekSelector from "./WeekSelector.js"

export default class Weeks {
    constructor(weekSelector) {
        this.weekSelector = weekSelector
        this.mainElement  = document.getElementsByTagName("main")[0]
        this.weeks        = Weeks.#create()

        weekSelector.element.addEventListener("change", () => this.rerender())
        this.rerender()
    }

    rerender() {
        this.mainElement.innerHTML = ""
        const week = this.weeks[this.weekSelector.number]
        this.mainElement.appendChild(week.element)
    }

    update() {
        for (const week of this.weeks)
            week.update()
    }
    
    static #create() {
        const weeks = []

        for (let number = 0; number < Week.COUNT; ++number) {
            const days = createDays(schedule, number)
            const week = new Week({ number, days })
            weeks.push(week)
        }

        return weeks

        function createDays(schedule, weekNumber) {
            const days = []

            for (const scheduleDay of schedule) {
                const lessons = createLessons(scheduleDay, weekNumber)
                const day     = new Day(lessons)
                days.push(day)
            }

            return days
        }

        function createLessons(day, weekNumber) {
            const isWeekEven = weekNumber % 2 !== 0 // Because weeks are counted from zero
            const lessons    = []

            for (const [oddLesson, evenLesson] of day) {
                const scheduleLesson = isWeekEven ? evenLesson : oddLesson
                const lessonArg      = skipLesson(scheduleLesson, weekNumber) ? {} : scheduleLesson
                const lesson         = new Lesson(lessonArg)
                lessons.push(lesson) 
            }

            return lessons

            function skipLesson(lesson, weekNumber) {
                return lesson == null || (lesson.weeks?.includes(weekNumber) ?? false)
            }
        }
    }
}

