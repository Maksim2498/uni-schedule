import Day  from "./Day.js"
import Week from "./Week.js"

import * as c from "./consts.js"

const weeks           = createWeeks(c.SCHEDULE)
const currentWeek     = Week.currentNumber
const scheduleElement = document.getElementById("schedule")

const weekSelectorElement    = document.getElementById("week-selector")
weekSelectorElement.value    = currentWeek + 1
weekSelectorElement.onchange = updateWeek
weekSelectorElement.max      = c.WEEK_COUNT

const currentWeekElement     = document.getElementById("current-week")
currentWeekElement.innerHTML = currentWeek + 1

updateWeek()

function updateWeek() {
    const weekNumber         = weekSelectorElement.value
    const week                = weeks[weekNumber - 1]
    scheduleElement.innerHTML = ""
    scheduleElement.appendChild(week.render())
}

function createWeeks(schedule) {
    const weeks = []

    for (let i = 0; i < c.WEEK_COUNT; ++i) {
        const isEven = i % 2 != 0

        const days = []

        for (const day of schedule) {
            const classes = []

            for (const [odd, even] of day) {
                const item = isEven ? even : odd

                if (item == null
                 || item.weeks != null && !item.weeks.includes(i)) {
                    classes.push([]) 
                    continue
                }

                classes.push(item)
            }

            days.push(new Day(classes))
        }

        const week = new Week({
            number: i,
            days
        }) 

        weeks.push(week)
    }

    return weeks
}
