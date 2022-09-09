export function clamp(v, l, h) {
    if (v < l)
        return l

    if (v > h)
        return h

    return v
}
