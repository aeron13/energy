/**
 * Given an array of energy data ordered by date and a field (es. 'prod'), 
 * returns an array of numbers where each number is the average value of <field> for that day
 */
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
        daySum = obj[field];
      }
    })
    return averages
}

/**
 * Given an array of energy data and a field (es. 'prod'),
 * returns the sum of all the <field> values.
 */
const getValueFromField = (array: any[], field: string): number => {
    const initialValue = array[0][field]
    return Math.floor(array.reduce((sum, current) => {
      if (current[field]) return sum + current[field]
      return sum
    }, initialValue ))
}

/**
* Given an array of energy data ordered by date and 2 fields (es. 'prod' and 'toGrid'),
* returns the daily average percentage of the 2nd field compared to the 1st field:
* for example, the daily average percentage of produced energy that was injected to the grid. 
*/
const getAverageRateFromFields = (array: any[], field1: string, field2: string): number => {

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

/**
 * Given an array of energy data ordered by date and a field (es. 'prod'),
 * returns the daily average value of that field.
 */
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

/**
 * Given an array of energy data and a field (es. 'prod'),
 * returns the average value of that field (not grouped by day).
 */
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