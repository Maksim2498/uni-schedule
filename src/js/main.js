import Clock  from "./Clock.js"
import Day    from "./Day.js"
import Lesson from "./Lesson.js"
import Week   from "./Week.js"

import schedule from "./schedule.js"

import * as ed from "./edate.js"
import * as em from "./emath.js"

const weeks               = createWeeks(schedule)
const mainElement         = document.getElementsByTagName("main")[0]
const weekSelectorElement = document.getElementById("week-selector")
const currentWeekElement  = document.getElementById("current-week")
const clockElement        = document.getElementById("clock")
const clock               = new Clock(clockElement)

setup()

function setup() {
    setupWeekSelectorElement()
    setupCurrentWeekElement()
    setupMainElement()
    setupUpdate()
}

function setupWeekSelectorElement() {
    weekSelectorElement.value    = Week.number + 1
    weekSelectorElement.onchange = () => displayWeek(weekSelectorElement.value - 1)
    weekSelectorElement.max      = Week.COUNT 
}

function setupCurrentWeekElement() {
    updateCurrentWeekElement()
}

function setupMainElement() {
    displayWeek(Week.number)
}

function setupUpdate() {
    const dayMillis   = 1000 * 60 * 60 * 24
    const todayMillis = ed.millis()

    for (const times of Lesson.TIMES) 
        for (const time of times) {
            const millis = ed.timeToMillis(time)
            let   delta  = millis - todayMillis 

            if (delta < 0)
                delta += dayMillis

            setTimeout(() => setInterval(updateWeeks, dayMillis), delta)
        }

    setTimeout(() => setInterval(updateCurrentWeek, dayMillis), dayMillis - todayMillis)
}

function updateCurrentWeekElement() {
    currentWeekElement.innerHTML = Week.number + 1 
}

function updateWeeks() {
    for (const week of weeks)
        week.update()

    displayWeek(weekSelectorElement.value - 1)    
}

function displayWeek(weekNumber) {
    const weekIndex       = em.clamp(weekNumber, 0, Week.COUNT - 1)
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
