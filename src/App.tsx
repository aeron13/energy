import { useState, useReducer, useEffect } from 'react';
import { DateTime } from "luxon";
import { fetchDyDate } from "./ts/api"
import { datesReducer } from './ts/reducers';
import { getTotalAmountFromField, getValuesFromField, getDayAverageFromField, getAverageRateFromFields, getTimestamps } from './ts/getters'; 
import { num, dt } from './ts/formatters';

import DisplayData from './components/DisplayData';
import ErrorMessage from "./components/ErrorMessage";
import Button from "./components/Button";
import Chart from './components/Chart';
import DataGroup from './components/DataGroup';


export default function App() {

  const URL = import.meta.env.VITE_URL ?? ''
  const defaultDate = DateTime.fromISO('2024-10-12')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({state: false, message: ''})

  const [dates, updateDates] = useReducer(
    datesReducer.bind(defaultDate), 
    {start: defaultDate, end: defaultDate, timespan: 'day', isDailyView: true}
  )

  const [timestamps, setTimestamps] = useState([''])

  const [energyData, setEnergyData] = useState({
    production: [0],
    consumption: [0],
    withdrawal: [0],
    injection: [0],
    totalProduction: 0,
    totalConsumption: 0,
    totalSelfConsumption: 0,
    totalInjection: 0,
    totalWithdrawal: 0,
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
              totalSelfConsumption: getTotalAmountFromField(json, 'self'),
              totalInjection: getTotalAmountFromField(json, 'toGrid'),
              totalWithdrawal: getTotalAmountFromField(json, 'fromGrid'),
              averageProdByDay: getDayAverageFromField(json, 'prod'),
              averageConsByDay: getDayAverageFromField(json, 'cons'),
              averageToGridByDay: getDayAverageFromField(json, 'toGrid'),
              averageRate: getAverageRateFromFields(json, 'prod', 'toGrid'),
              consumptionRate: getAverageRateFromFields(json, 'cons', 'self')
            })
            setTimestamps(getTimestamps(json, dates.timespan))
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
    <div className="py-8 lg:py-10 container mx-auto px-4">

      <div className="flex mb-3 bg-white rounded-md">
        <Button onClick={selectTodayValues} selected={dates.timespan === 'day'} disabled={isLoading}>Today</Button>
        <Button onClick={selectWeeklyValues} selected={dates.timespan === 'week'} disabled={isLoading}>This week</Button>
        <Button onClick={selectMonthlyValues} selected={dates.timespan === 'month'} disabled={isLoading}>This month</Button>
        <Button onClick={selectLastMonthValues} selected={dates.timespan === 'last-month'} disabled={isLoading}>Last month</Button>
      </div>
      <div className="mb-6 text-sm md:text-base">
        { dates.start.toISODate() !== dates.end.toISODate() && 
          <p className=''>From <strong>{dt(dates.start)}</strong> to <strong>{dt(dates.end)}</strong></p>
        }
        { dates.start.toISODate() === dates.end.toISODate() && <p><b>{dt(dates.start)}</b></p>}
      </div>

      { isLoading && <div>Loading...</div> }
      { (!isLoading && error.state) && <ErrorMessage message={error.message} /> }

      { (!isLoading && !error.state) &&
        <div>
          <div className='lg:grid lg:grid-cols-4'>
            <div className='lg:col-span-2 xl:col-span-3 relative bg-white rounded-lg p-3 pb-5'>
              <Chart 
                data={[
                  {type: 'Production', data: energyData.production},
                  {type: 'Consumption', data: energyData.consumption},
                  {type: 'Grid injection', data: energyData.injection},
                  {type: 'Grid withdrawal', data: energyData.withdrawal}
                ]} 
                timestamps={timestamps}
                loading={isLoading}
              />
            </div>
            <div className='lg:col-span-2 xl:col-span-1 lg:pl-6'>
              <div className='bg-white p-6 rounded-lg mt-12 lg:mt-0 lg:flex lg:flex-col'>
                <DataGroup title="Production">
                  <DisplayData title="" value={num(energyData.totalProduction)} unit="kWh" color="text-teal" size='' />
                </DataGroup>
                <DataGroup title="Consumption">
                  <DisplayData title="" value={num(energyData.totalConsumption)} unit="kWh" color="text-orange" size='' />
                  <DisplayData title="Self consumption" value={num(energyData.totalSelfConsumption)} unit="kWh" color="" size='sm' />
                </DataGroup>
                <DataGroup title="Grid">
                  <div className='lg:col-span-2'></div>
                  <DisplayData title="Grid injection" value={num(energyData.totalInjection)} unit="kWh" color="" size='sm' />
                  <DisplayData title="Grid withdrawal" value={num(energyData.totalWithdrawal)} unit="kWh" color="" size='sm' />
                  <DisplayData title="Average grid injection" value={num(energyData.averageToGridByDay)} unit="kWh" color="" size='sm' />
                </DataGroup>
                <DataGroup title="">
                  <DisplayData title="How much of the produced energy you pushed on the grid?" value={num(energyData.averageRate)} unit="%" color="" size='' />
                </DataGroup>
                <DataGroup title="">
                  <DisplayData title="How much of the consumed energy you produced?" value={num(energyData.consumptionRate)} unit="%" color="" size='' />
                </DataGroup>
              </div>
            </div>
          </div>
        </div> 
      }
    </div>
  );
}