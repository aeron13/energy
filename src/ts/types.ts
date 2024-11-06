import { DateTime } from "luxon"

type TApiData = {
    ts: string,
    prod: number,
    cons: number,
    self: number,
    fromGrid: number,
    toGrid: number
}

type TDisplayData = {
    title: string,
    value: number|string, 
    unit: string
}

type TDates = {
    start: DateTime,
    end: DateTime,
    timespanIndex: number
}

type TDatesAction = {
    timespan: string
}

export type {
    TApiData,
    TDisplayData,
    TDates,
    TDatesAction
}