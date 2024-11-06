import { DateTime } from "luxon";

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
 * Given an array of energy data ordered by date and a field (es. 'prod'), 
 * returns an array of numbers where each number is the daily total amount for that field.
 * For example, returns the daily amounts of production for each day present in the array.
 */
const dailyValuesFromField = (array: any[], field: string): number[] => {
  if (array.length === 0)
    return []

  let daySum = 0;
  const sums: number[] = [];
  array.forEach((obj, i) => {
    if(i === 0) {
      daySum = obj[field] ?? 0
    } else if (i === array.length - 1) {
      sums.push(daySum);
    }
    else if (array[i-1].ts.slice(0, 10) === obj.ts.slice(0, 10)) {
        daySum += obj[field]
    } else {
      sums.push(daySum);
      daySum = obj[field];
    }
  })

  return sums;
}

const getValuesFromField = (array: any[], field: string): any[] => {
  if (array.length === 24) {
    return array.map(obj => obj[field]?.toFixed(2))
  }
  return dailyValuesFromField(array, field)
}

const getTimestamps = (array: any[]): any[] => {
  if (array.length === 24) {
    return array.map(obj => obj.ts.slice(11, 16))
  }
  else {
    // const days = [1];
    // for (let i = 2; i < 31; i++) {
    //   days.push(i)
    // }
    // return days
    return array.filter((obj, i) => {
      const day = obj.ts.slice(8, 10)
      if (i === 0) return day
        else if (array[i-1].ts.slice(8, 10) !== day) {
          return day
        }
    }).map(obj => obj.ts.slice(8, 10))
  }
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
* returns the average percentage of the 2nd field compared to the 1st field by day.
* For example, the average percentage of daily produced energy that was injected to the grid. 
*/
const getAverageRateFromFields = (array: any[], field1: string, field2: string): number => {

    if (array.length === 0)
        return 0

    const dailyField1 = dailyValuesFromField(array, field1)
    const dailyField2 = dailyValuesFromField(array, field2)

    if(dailyField1.length === 0 || dailyField2.length === 0 || dailyField1.length !== dailyField2.length)
        return 0

    const rates = dailyField1.map((value1, i) => {
        if (value1 === 0) return 0
        return dailyField2[i] * 100 / value1
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
    
    const dailyValues = dailyValuesFromField(array, field)

    if (dailyValues.length < 1)
        return 0

    if (dailyValues.length === 1 && array.length === 24)
      return Math.floor(dailyValues[0] / 24)
    
    let sum = dailyValues.reduce((sum, curr) => {
      if (!sum || !curr) return 0
      return sum + curr
    })
  
    return Math.floor(sum / dailyValues.length)
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
    getValuesFromField,
    getAverageFromField,
    getDayAverageFromField,
    getAverageRateFromFields,
    getTimestamps
}