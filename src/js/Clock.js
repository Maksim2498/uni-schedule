import * as es from "./estyle.js"

export default class Clock {
    #interval

    constructor(canvas) {
        this.canvas     = canvas
        this.autoRedraw = true
        this.redraw()
    }

    get autoRedraw() {
        return this.#interval !== undefined
    }

    set autoRedraw(val) {
        if (this.autoRedraw === val)
            return

        if (val)
            this.#interval = setInterval(() => this.redraw(), 500)
        else
            clearInterval(this.#interval)
    }

    redraw() {
        try {
            this.#updateSize()

            const ctx = this.canvas.getContext("2d")

            this.#clear(ctx)
            this.#draw(ctx)
        } catch (e) {
            console.error(e)
        }
    }

    #updateSize() {
        this.canvas.width  = this.canvas.offsetWidth
        this.canvas.height = this.canvas.offsetHeight
    }

    #clear(ctx) {
        ctx.clearRect(0, 0, this.width, this.height)
    }

    #draw(ctx) {
        ctx.save()

        ctx.lineCap     = "round"
        ctx.fillStyle   = es.getVariable("color")
        ctx.strokeStyle = es.getVariable("background-color")
        ctx.translate(this.width / 2, this.height / 2)

        this.#drawBackground(ctx)
        this.#drawForeground(ctx)

        ctx.restore()
    }

    #drawBackground(ctx) {
        this.#drawBody(ctx)
        this.#drawDivisions(ctx)
    }

    #drawBody(ctx) {
        ctx.beginPath()
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI) 
        ctx.fill()
    }

    #drawDivisions(ctx) {
        const angleDelta = Math.PI / 6
        const radius     = this.radius

        for (let angle = 0; angle <= 2 * Math.PI; angle += angleDelta) {
            const dx = Math.sin(angle)
            const dy = Math.cos(angle)

            const ex = dx * radius
            const ey = dy * radius

            const bx = .75 * ex
            const by = .75 * ey

            ctx.beginPath()
            ctx.moveTo(bx, by)
            ctx.lineTo(ex, ey)
            ctx.stroke()
        }
    }

    #drawForeground(ctx) {
        const date        = new Date()
        const angleFactor = 2 * Math.PI
        const angleDelta  = -Math.PI / 2

        const hours      = date.getHours()
        const hoursAngle = hours / 12 * angleFactor + angleDelta
        this.#strokeArrow(ctx, hoursAngle, .5)

        const minutes      = date.getMinutes();
        const minutesAngle = minutes / 60 * angleFactor + angleDelta
        this.#strokeArrow(ctx, minutesAngle, .75)

        const seconds      = date.getSeconds()
        const secondsAngle = seconds / 60 * angleFactor + angleDelta
        this.#strokeArrow(ctx, secondsAngle, 1)
    }

    #strokeArrow(ctx, angle, length) {
        const r = this.radius
        const x = Math.cos(angle) * r * length
        const y = Math.sin(angle) * r * length

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(x, y) 
        ctx.stroke()
    }

    get radius() {
        return Math.min(this.canvas.width, this.canvas.height) / 2
    }

    get width() {
        return this.canvas.width
    }

    get height() {
        return this.canvas.height
    }
}
