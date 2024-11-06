import { useState, useReducer, useEffect } from 'react'
import DisplayData from "./components/DisplayData";
import ErrorMessage from "./components/ErrorMessage";
import Button from "./components/Button";
import { DateTime } from "luxon";
import { fetchDyDate } from "./ts/api"
import { datesReducer } from './ts/reducers';
import { getValueFromField, getDayAverageFromField, getAverageRateFromFields } from './ts/getters'; 
import { num, numW } from './ts/formatters';

export default function App() {

  const URL = import.meta.env.VITE_URL ?? ''
  const defaultDate = DateTime.fromISO('2024-10-14')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({state: false, message: ''})

  const [dates, updateDates] = useReducer(
    datesReducer.bind(defaultDate), 
    {start: defaultDate, end: defaultDate, timespanIndex: 0}
  )

  const [energyData, setEnergyData] = useState({
    production: 0,
    consumption: 0,
    withdrawal: 0,
    injection: 0,
    averageProdByDay: 0,
    averageConsByDay: 0,
    averageToGridByDay: 0,
    averageRate: 0
  })

  useEffect(() => {
    if(!isLoading) {
      setIsLoading(true)
      setTimeout(() => {
        fetchDyDate(URL, dates.start, dates.end)
        .then(json => {
          // console.log(json)
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
              injection: getValueFromField(json, 'toGrid'),
              averageProdByDay: getDayAverageFromField(json, 'prod'),
              averageConsByDay: getDayAverageFromField(json, 'cons'),
              averageToGridByDay: getDayAverageFromField(json, 'toGrid'),
              averageRate: getAverageRateFromFields(json, 'prod', 'toGrid')
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
    <div className="pt-20 container mx-auto">

      <div className="flex gap-2 mb-3 border-b border-1 py-3">
        <Button onClick={selectTodayValues} selected={dates.timespanIndex === 0}>Today</Button>
        <Button onClick={selectWeeklyValues} selected={dates.timespanIndex === 1}>This week</Button>
        <Button onClick={selectMonthlyValues} selected={dates.timespanIndex === 2}>This month</Button>
        <Button onClick={selectLastMonthValues} selected={dates.timespanIndex === 3}>Last month</Button>
      </div>
      <div className="mb-6">
        { dates.start.toISODate() !== dates.end.toISODate() && 
          <p>From {dates.start.toFormat('MMMM d')} to {dates.end.toFormat('MMMM d')}</p>
        }
        { dates.start.toISODate() === dates.end.toISODate() && <p>{dates.start.toFormat('MMMM d')}</p>}
      </div>

      { isLoading && <div>Loading...</div> }

      { (!error.state && !isLoading) &&
        <div>
          <div className="grid grid-cols-2 gap-y-10">
            <DisplayData title="Production" value={num(energyData.production)} unit="kW" />
            <DisplayData title="Consumption" value={num(energyData.consumption)} unit="kW" />
            <DisplayData title="Grid withdrawal" value={num(energyData.withdrawal)} unit="kW" />
            <DisplayData title="Grid injection" value={num(energyData.injection)} unit="kW" />
          </div>
          <p className='mt-6'>Production - consumption: {energyData.production - energyData.consumption}</p>
          <p>Grid with - grid inj: {energyData.withdrawal - energyData.injection}</p>

          { dates.timespanIndex !== 0 &&
           <div className='mt-6'>
            {/* <p className=''>Average production: {averageProd}</p> */}
            <p>Average production by day: {numW(energyData.averageProdByDay)}</p>
            <p>Average consumption by day: {numW(energyData.averageConsByDay)}</p>
            <p>Average grid injection by day: {numW(energyData.averageToGridByDay)}</p>
            <p>Average rate of grid injection / production: {num(energyData.averageRate)}%</p>
          </div>
          }
        </div>
      }
      { (!isLoading && error.state) && <ErrorMessage message={error.message} /> }
    
    </div>
  );
}