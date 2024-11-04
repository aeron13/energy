import { useEffect, useReducer } from "react";
import DisplayData from "./components/DisplayData"; 
import ErrorMessage from "./components/ErrorMessage";
import Button from "./components/Button";
import { useState } from "react";
import { DateTime } from "luxon";
import { fetchDyDate } from "./api"

const URL = process.env.REACT_APP_URL
const defaultDate = DateTime.fromISO('2024-10-14')

const getValueFromField = (array, field) => {
  const initialValue = array[0][field]
  return Math.floor(array.reduce((sum, current) => {
    if (current[field]) return sum + current[field]
    return sum
  }, initialValue ))
}

  const datesReducer = (state, action) => {
    switch (action.timespan) {
      default: {
        return {
          start: defaultDate,
          end: defaultDate,
          timespanIndex: 0
        }
      }
      case 'week': {
        return {
          start: defaultDate.minus({days: 6}),
          end: defaultDate,
          timespanIndex: 1
        }
      }
      case 'month': {
        return {
          start: defaultDate.set({day: 1}),
          end: defaultDate,
          timespanIndex: 2
        }
      }
      case 'last-month': {
        const lastMonth = defaultDate.minus({month: 1})
        return {
          start: lastMonth.set({day: 1}),
          end: lastMonth.set({day: lastMonth.daysInMonth}),
          timespanIndex: 3
        }
      }
    }
  }

function App() {

  const [dates, updateDates] = useReducer(datesReducer, {start: defaultDate, end: defaultDate, timespanIndex: 0}) 

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({state: false, message: ''})

  const [energyData, setEnergyData] = useState({
    production: 0,
    consumption: 0,
    withdrawal: 0,
    injection: 0
  })

  useEffect(() => {
    if(!isLoading) {
      setIsLoading(true)
      setTimeout(() => {
        fetchDyDate(URL, dates.start, dates.end)
        .then(json => {
          console.log(json)
          setIsLoading(false)
          if (json.length === 0) {
            setError({
              state: true,
              message: 'Data not available for selected timespan. Try with a different one'
            })
          } else {
            setEnergyData({
              production: getValueFromField(json, 'prod'),
              consumption: getValueFromField(json, 'cons'),
              withdrawal: getValueFromField(json, 'fromGrid'),
              injection: getValueFromField(json, 'toGrid')
            })
          }
        })
        .catch(err => {
          console.log(err)
          setIsLoading(false)
          setError({
            state: true,
            message: `Error: ${err}`
          })
        })
      }, 1000)
    }
    return () => { 
      setIsLoading(false)
      setError({
        state: false,
        message: ''
      })
     }
  }, [URL, dates] )

  const selectTodayValues = () => {
    updateDates({timespan: 'today'})
  }

  const selectWeeklyValues = () => {
    updateDates({timespan: 'week'})
  }

  const selectMonthlyValues = () => {
    updateDates({timespan: 'month'})
  }

  const selectLastMonthValues = () => {
    updateDates({timespan: 'last-month'})
  }

  return (
    <div className="pt-60 container mx-auto">

      <div className="flex gap-2 mb-3 border-b border-1 py-3">
        <Button onClick={selectTodayValues} selected={dates.timespanIndex === 0}>Today</Button>
        <Button onClick={selectWeeklyValues} selected={dates.timespanIndex === 1}>This week</Button>
        <Button onClick={selectMonthlyValues} selected={dates.timespanIndex === 2}>This month</Button>
        <Button onClick={selectLastMonthValues} selected={dates.timespanIndex === 3}>Last month</Button>
      </div>
      <div className="mb-6">
        { dates.start.toISODate() !== dates.end.toISODate() && 
          <p>Showing values from {dates.start.toFormat('MMMM d')} to {dates.end.toFormat('MMMM d')}</p>
        }
        { dates.start.toISODate() === dates.end.toISODate() && <p>{dates.start.toFormat('MMMM d')}</p>}
      </div>

      { isLoading && <div>Loading...</div> }

      { (!error.state && !isLoading) &&
        <div>
          <div className="grid grid-cols-2 gap-y-10">
            <DisplayData title="Production" value={energyData.production} unit="kWh" />
            <DisplayData title="Consumption" value={energyData.consumption} unit="kWh" />
            <DisplayData title="Grid withdrawal" value={energyData.withdrawal} unit="kWh" />
            <DisplayData title="Grid injection" value={energyData.injection} unit="kWh" />
          </div>
        </div>
      }
      { (!isLoading && error.state) && <ErrorMessage message={error.message} /> }

    </div>
  );
}

export default App;
