import { DateTime } from "luxon";
import type { TApiData } from "./types";

/**
 * Mocks the behavior of a real API call, by fetching the json available and the given endpoint
 * and then filtering the data according to given start and end dates.
 */
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

export {
    fetchDyDate
}