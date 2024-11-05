import { DateTime } from "luxon";
import type { TApiData } from "./types";

const fetchDyDate = async (url: string, startDate: DateTime, endDate: DateTime) => {
    let data: any[] = []
    await fetch(url)
    .then((res) => res.json())
    .then((json) => {
        data = json.filter((val: TApiData) => {
            const date = DateTime.fromISO(val.ts.slice(0, 10))
            if (startDate.toISODate() === endDate.toISODate()) {
                return date.toISODate() === startDate.toISODate();
            }
            return date >= startDate && date <= endDate
        });
    })
    .catch((err) => {
        throw err
    });
  
    return data
};

const getValueFromField = (array: any[], field: string) => {
    const initialValue = array[0][field]
    return Math.floor(array.reduce((sum, current) => {
      if (current[field]) return sum + current[field]
      return sum
    }, initialValue ))
}

export {
    fetchDyDate,
    getValueFromField
}