import { DateTime } from "luxon"

type TApiData = {
    ts: string,
    prod: number,
    cons: number,
    self: number,
    fromGrid: number,
    toGrid: number
}

type TNum = number | string

type TApiField = 'prod' | 'cons' | 'self' | 'fromGrid' | 'toGrid'

type TDates = {
    start: DateTime,
    end: DateTime,
    timespan: string,
    isDailyView: boolean
}

type TDatesAction = {
    timespan: string
}

export type {
    TNum,
    TApiData,
    TApiField,
    TDates,
    TDatesAction
}