import { useEffect } from "react";
import { useState } from "react";
import { DateTime } from "luxon";

const useFetchDyDate = (url, startDate, endDate) => {

    const [data, setData] = useState(null);
    
    useEffect(() => {

        fetch(url)
        .then((res) => res.json())
        .then((json) => {
            const query = json.filter(val => {
                const date = DateTime.fromISO(val.ts.slice(0, 10))
                if (startDate === endDate) return date === startDate;
                return date >= startDate && date <= endDate
            });
            setData(query)
        })
        .catch((err) => console.log(err));

    }, [url]);
  
    return [data];

  };

  export default useFetchDyDate;