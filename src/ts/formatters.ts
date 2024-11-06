const num = (n: number): string => {
    return n.toLocaleString()
}

const numW = (n: number): string => {
    return `${n.toLocaleString()} kW`
}

export {
    num,
    numW
}