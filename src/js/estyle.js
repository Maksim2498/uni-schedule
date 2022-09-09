export function getVariable(name) {
    return getRootProperty(`--${name}`)
}

export function getRootProperty(name) {
    const style = getComputedStyle(document.body)
    return style.getPropertyValue(name)
}
