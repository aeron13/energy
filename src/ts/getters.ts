import { DateTime } from "luxon";
import { TApiData, TApiField, TNum } from "./types";

/**
 * Given an array of energy data ordered by date and a field (es. 'prod'), 
 * returns an array of numbers where each number is the daily total amount for that field.
 * For example, returns the daily amounts of production for each day present in the array.
 */
const dailyValuesFromField = (array: TApiData[], field: TApiField): number[] => {
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

/**
 * Given an array of energy data ordered by date and a field (es. 'prod'), 
 * if it's the daily view returns the array of <field> values.
 * If not, returns an array containing the total amount of <field> for each day
 */
const getValuesFromField = (array: TApiData[], field: TApiField, dailyView = false): any[] => {
  if (dailyView) {
    return array.map(obj => obj[field]?.toFixed(0))
  }
  return dailyValuesFromField(array, field).map(val => Math.floor(val))
}

/**
 * Generates an array of date or time values for the chart
 */
const getTimestamps = (array: TApiData[], type: string): string[] => {
  switch(type) {
    case 'day': {
      // daily view
      return array.map(obj => obj.ts.slice(11, 16))
    }
    case 'week': {
      // weekly view
      return array.filter((obj, i) => {
        const day = obj.ts.slice(8, 10)
        if (i === 0) return day
          else if (array[i-1].ts.slice(8, 10) !== day) {
            return day
          }
      }).map(obj => { 
        const day = obj.ts.slice(0, 10)
        return DateTime.fromISO(day).toFormat('EEE dd')
      })
    }
    default: {
      // monthly view
      let day = DateTime.fromISO(array[0].ts.slice(0, 10))
      let days: string[] = []
      if (day.daysInMonth) {
        for (let i = 1; i <= day.daysInMonth; i++ ) {
          days.push(day.set({day: i}).toFormat('dd'))
        }
      }
      return days;
    }
  }
}

/**
 * Given an array of energy data and a field (es. 'prod'),
 * returns the sum of all the <field> values.
 */
const getTotalAmountFromField = (array: TApiData[], field: TApiField): number => {
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
const getAverageRateFromFields = (array: TApiData[], field1: TApiField, field2: TApiField): number => {

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
const getDayAverageFromField = (array: TApiData[], field: TApiField, dailyView = false) => {

    if (array.length === 0)
      return 0
    
    const dailyValues = dailyValuesFromField(array, field)

    if (dailyValues.length < 1)
        return 0

    if (dailyView)
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
const getAverageFromField = (array: TApiData[], field: TApiField) => {
    if (array.length === 0)
      return 0
  
    const startingValue = array[0][field];
    const sum = array.reduce((sum, curr) => {
      return sum + curr[field]
    }, startingValue)
  
    return Math.floor(sum / array.length)
}

/**
 * Given an array of energy data ordered by date and a field (es. 'prod'), 
 * returns an array of numbers where each number is the average value of <field> for that day
 */
const getDayAverages = (array: TApiData[], field: TApiField): number[] => {
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

export {
    getDayAverages,
    getTotalAmountFromField,
    getValuesFromField,
    getAverageFromField,
    getDayAverageFromField,
    getAverageRateFromFields,
    getTimestamps
}