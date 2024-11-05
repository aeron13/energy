import { DateTime } from "luxon"
import type { TDates, TDatesAction } from "./types"

function datesReducer(this: DateTime|undefined, state: TDates, action: TDatesAction) {
    
    const defaultDate = this ?? DateTime.now()

    switch (action.timespan) {
        default: {
            return {
                start: defaultDate,
                end: defaultDate,
                timespanIndex: 0
            }
        }
        case 'week': {
            return {
                start: defaultDate.minus({days: 6}),
                end: defaultDate,
                timespanIndex: 1
            }
        }
        case 'month': {
            return {
                start: defaultDate.set({day: 1}),
                end: defaultDate,
                timespanIndex: 2
            }
        }
        case 'last-month': {
            const lastMonth = defaultDate.minus({month: 1})
            return {
                start: lastMonth.set({day: 1}),
                end: lastMonth.set({day: lastMonth.daysInMonth}),
                timespanIndex: 3
            }
        }
    }
}

export {
    datesReducer
}