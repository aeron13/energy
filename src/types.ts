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
    value: number, 
    unit: string
}

export type {
    TApiData,
    TDisplayData
}