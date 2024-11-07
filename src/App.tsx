import { useState, useReducer, useEffect } from 'react'
import DisplayData from './components/DisplayData';
import ErrorMessage from "./components/ErrorMessage";
import Button from "./components/Button";
import Chart from './components/Chart';
import { DateTime } from "luxon";
import { fetchDyDate } from "./ts/api"
import { datesReducer } from './ts/reducers';
import { getTotalAmountFromField, getValuesFromField, getDayAverageFromField, getAverageRateFromFields, getTimestamps } from './ts/getters'; 
import { num } from './ts/formatters';


export default function App() {

  const URL = import.meta.env.VITE_URL ?? ''
  const defaultDate = DateTime.fromISO('2024-10-12')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({state: false, message: ''})

  const [dates, updateDates] = useReducer(
    datesReducer.bind(defaultDate), 
    {start: defaultDate, end: defaultDate, timespanIndex: 0, isDailyView: true}
  )

  const [timestamps, setTimestamps] = useState([''])

  const [energyData, setEnergyData] = useState({
    production: [0],
    consumption: [0],
    withdrawal: [0],
    injection: [0],
    totalProduction: 0,
    totalConsumption: 0,
    averageProdByDay: 0,
    averageConsByDay: 0,
    averageToGridByDay: 0,
    averageRate: 0,
    consumptionRate: 0
  })

  useEffect(() => {
    if(!isLoading) {
      setIsLoading(true)
      setTimeout(() => {
        fetchDyDate(URL, dates.start, dates.end)
        .then(json => {
          setIsLoading(false)
          if (json.length === 0) {
            setError({
              state: true,
              message: 'Data not available for selected timespan. Try with a different one'
            })
          } else {
            setEnergyData({
              production: getValuesFromField(json, 'prod', dates.isDailyView),
              consumption: getValuesFromField(json, 'cons', dates.isDailyView),
              withdrawal: getValuesFromField(json, 'fromGrid', dates.isDailyView),
              injection: getValuesFromField(json, 'toGrid', dates.isDailyView),
              totalProduction: getTotalAmountFromField(json, 'prod'),
              totalConsumption: getTotalAmountFromField(json, 'cons'),
              averageProdByDay: getDayAverageFromField(json, 'prod'),
              averageConsByDay: getDayAverageFromField(json, 'cons'),
              averageToGridByDay: getDayAverageFromField(json, 'toGrid'),
              averageRate: getAverageRateFromFields(json, 'prod', 'toGrid'),
              consumptionRate: getAverageRateFromFields(json, 'cons', 'self')
            })
            setTimestamps(getTimestamps(json, dates.timespanIndex))
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
    <div className="pt-10 container mx-auto">

      <div className="flex gap-2 mb-3 border-b border-1 py-3">
        <Button onClick={selectTodayValues} selected={dates.timespanIndex === 0}>Today</Button>
        <Button onClick={selectWeeklyValues} selected={dates.timespanIndex === 1}>This week</Button>
        <Button onClick={selectMonthlyValues} selected={dates.timespanIndex === 2}>This month</Button>
        <Button onClick={selectLastMonthValues} selected={dates.timespanIndex === 3}>Last month</Button>
      </div>
      <div className="mb-6">
        { dates.start.toISODate() !== dates.end.toISODate() && 
          <p>From {dates.start.toFormat('MMMM dd, y')} to {dates.end.toFormat('MMMM dd, y')}</p>
        }
        { dates.start.toISODate() === dates.end.toISODate() && <p>{dates.start.toFormat('MMMM dd, y')}</p>}
      </div>

      { isLoading && <div>Loading...</div> }
      { (!isLoading && error.state) && <ErrorMessage message={error.message} /> }

        <div>
          <div className='grid lg:grid-cols-4'>
            <div className='lg:col-span-3'>
              <Chart 
                data={[
                  {type: 'Production', data: energyData.production},
                  {type: 'Consumption', data: energyData.consumption},
                  {type: 'Grid injection', data: energyData.injection}
                ]} 
                timestamps={timestamps}
                loading={isLoading}
              />
            </div>
            <div className='pl-12'>
              { (!isLoading && !error.state) &&
              <div className='mt-6 flex flex-col gap-6'>
                <DisplayData title="Production" value={num(energyData.totalProduction)} unit="kWh" color="text-teal" />
                <DisplayData title="Consumption" value={num(energyData.totalConsumption)} unit="kWh" color="text-orange" />
                <DisplayData title="Average grid injection by day" value={num(energyData.averageToGridByDay)} unit="kWh" color="" />
                <DisplayData title="Average rate of grid injection / production" value={num(energyData.averageRate)} unit="%" color="" />
                <DisplayData title="Average rate of self consumption / production" value={num(energyData.consumptionRate)} unit="%" color="" />
              </div>
              }
            </div>
          </div>
        </div>    
    </div>
  );
}