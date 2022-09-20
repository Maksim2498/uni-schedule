import Week from "./Week.js"

export default class CurrentWeek {
    constructor(currentWeekId) {
        this.element  = document.getElementById(currentWeekId)
        this.rerender()
    }

    rerender() {
        this.number = Week.number + 1 
    }

    get number() {
        return Number(this.element.innerHTML)
    }

    set number(val) {
        this.element.innerHTML = val
    }
}
