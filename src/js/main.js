import Day    from "./Day.js"
import Lesson from "./Lesson.js"
import Week   from "./Week.js"

import schedule from "./schedule.js"

import { clamp } from "./emath.js"

const weeks       = createWeeks(schedule)
const weekNumber  = Week.number
const mainElement = document.getElementsByTagName("main")[0]

const weekSelectorElement    = document.getElementById("week-selector")
weekSelectorElement.value    = weekNumber + 1
weekSelectorElement.onchange = updateWeek
weekSelectorElement.max      = Week.COUNT 

const currentWeekElement     = document.getElementById("current-week")
currentWeekElement.innerHTML = weekNumber + 1 

updateWeek()

function updateWeek() {
    const weekNumber      = weekSelectorElement.value
    const weekIndex       = clamp(weekNumber - 1, 0, Week.COUNT - 1)
    const week            = weeks[weekIndex]
    mainElement.innerHTML = ""
    mainElement.appendChild(week.element)
}

function createWeeks(schedule) {
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
