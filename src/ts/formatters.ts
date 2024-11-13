import { DateTime } from "luxon"

const num = (n: number): string => {
    return n.toLocaleString()
}

const numW = (n: number): string => {
    return `${n.toLocaleString()} kW`
}

const dt = (date: DateTime): string => {
    return date.setLocale('en').toLocaleString(DateTime.DATE_FULL)
}

export {
    num,
    numW,
    dt
}