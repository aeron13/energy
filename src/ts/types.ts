import { DateTime } from "luxon"

type TApiData = {
    ts: string,
    prod: number,
    cons: number,
    self: number,
    fromGrid: number,
    toGrid: number
}

type TApiField = 'prod' | 'cons' | 'self' | 'fromGrid' | 'toGrid'

type TDisplayData = {
    title: string,
    value: number|string, 
    unit: string,
    color: string|undefined
}

type TDates = {
    start: DateTime,
    end: DateTime,
    timespanIndex: number,
    isDailyView: boolean
}

type TDatesAction = {
    timespan: string
}

export type {
    TApiData,
    TApiField,
    TDisplayData,
    TDates,
    TDatesAction
}