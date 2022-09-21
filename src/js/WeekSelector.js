import Week from "./Week.js"

import { clamp } from "./emath.js"

export default class WeekSelector {
    constructor(weekSelectorId) {
        this.element = document.getElementById(weekSelectorId)

        for (let i = 1; i <= Week.COUNT; ++i) {
            const optionElement = document.createElement("option")
            optionElement.innerHTML = i
            this.element.add(optionElement)
        }

        this.number                = Week.number
        this.element.selectedIndex = this.number 

        this.element.addEventListener("change", e => this.number = clamp(e.target.value - 1, 0, Week.number - 1))
    }
}
