import Clock        from "./Clock.js"
import CurrentWeek  from "./CurrentWeek.js"
import Updater      from "./Updater.js"
import Weeks        from "./Weeks.js"
import WeekSelector from "./WeekSelector.js"

const clock        = new Clock("clock")
const currentWeek  = new CurrentWeek("current-week")
const weekSelector = new WeekSelector("week-selector")
const weeks        = new Weeks(weekSelector)
const updater      = new Updater({ currentWeek, weeks })

// For debug purposes
export { clock, currentWeek, weekSelector, weeks, updater }
