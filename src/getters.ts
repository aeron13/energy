
const dayAverages = (array: any[], field: string): number[] => {
    let daySum = 0;
    const averages: number[] = [];
    array.forEach((obj, i) => {
      if(i === 0) {
        daySum = obj[field] ?? 0
      } else if (array[i-1].ts.slice(0, 10) === obj.ts.slice(0, 10)) {
          daySum += obj[field]
      } else {
        averages.push(daySum / 24);
        daySum = 0;
      }
    })
    return averages
}

const getValueFromField = (array: any[], field: string) => {
    const initialValue = array[0][field]
    return Math.floor(array.reduce((sum, current) => {
      if (current[field]) return sum + current[field]
      return sum
    }, initialValue ))
}

const getAverageRateFromFields = (array: any[], field1: string, field2: string) => {

    if (array.length === 0)
        return 0

    const averagesField1 = dayAverages(array, field1)
    const averagesField2 = dayAverages(array, field2)

    if(averagesField1.length === 0 || averagesField2.length === 0)
        return 0

    const rates = averagesField1.map((value1, i) => {
        if (value1 === 0) return 0
        return averagesField2[i] * 100 / value1
    })

    let sum = rates.reduce((sum, curr) => {
        if (!sum || !curr) return 0
        return sum + curr
      })
    
    return Math.floor(sum / rates.length)
}


const getDayAverageFromField = (array: any[], field: string) => {

    if (array.length === 0)
      return 0
    
    const averages = dayAverages(array, field)

    if (averages.length < 1)
        return 0
    
    let sum = averages.reduce((sum, curr) => {
      if (!sum || !curr) return 0
      return sum + curr
    })
  
    return Math.floor(sum / dayAverages.length)
}
  
const getAverageFromField = (array: any[], field: string) => {
    if (array.length === 0)
      return 0
  
    const startingValue = array[0][field];
    const sum = array.reduce((sum, curr) => {
      return sum + curr[field]
    }, startingValue)
  
    return Math.floor(sum / array.length)
}

export {
    getValueFromField,
    getAverageFromField,
    getDayAverageFromField,
    getAverageRateFromFields
}