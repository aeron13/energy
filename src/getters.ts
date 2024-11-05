const getValueFromField = (array: any[], field: string) => {
    const initialValue = array[0][field]
    return Math.floor(array.reduce((sum, current) => {
      if (current[field]) return sum + current[field]
      return sum
    }, initialValue ))
}

const getDayAverageFromField = (array: any[], field: string) => {

    if (array.length === 0)
      return 0
  
    let daySum = 0;
    const dayAverages: number[] = [];
    array.forEach((obj, i) => {
      if(i === 0) {
        daySum = obj[field] ?? 0
      } else if (array[i-1].ts.slice(0, 10) === obj.ts.slice(0, 10)) {
          daySum += obj[field]
      } else {
        dayAverages.push(daySum / 24);
        daySum = 0;
      }
    })
    
    let sum = dayAverages.reduce((sum, curr) => {
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
    getDayAverageFromField
  }