import { DateTime } from "luxon";

const fetchDyDate = async (url, startDate, endDate) => {
    let data = []
  
    await fetch(url)
    .then((res) => res.json())
    .then((json) => {
        data = json.filter(val => {
            const date = DateTime.fromISO(val.ts.slice(0, 10))
            if (startDate.toISODate() === endDate.toISODate()) return date.toISODate() === startDate.toISODate();
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