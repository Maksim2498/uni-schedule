export function withDateSubbed(date, n) {
    return withDateAdded(date, -n)
}

export function subDate(date, n) {
    return addDate(date, -n)
}

export function withDateAdded(date, n) {
    return addDate(new Date(date), n)
}

export function addDate(date, n) {
    date.setDate(date.getDate() + n)
    return date
}

export function toShortString(date) {
    return `${date.getDate()}.${date.getMonth() + 1}`
}
