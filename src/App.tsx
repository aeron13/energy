import { useState } from 'react'
import { useEffect } from "react";
import DisplayData from "./components/DisplayData";
import ErrorMessage from "./components/ErrorMessage";
import Button from "./components/Button";
import { DateTime } from "luxon";
import { fetchDyDate } from "./api"

const getValueFromField = (array: any[], field: string) => {
  const initialValue = array[0][field]
  return Math.floor(array.reduce((sum, current) => {
    if (current[field]) return sum + current[field]
    return sum
  }, initialValue ))
}

export default function App() {

  const URL = import.meta.env.VITE_URL ?? ''
  const defaultDate = DateTime.fromISO('2024-10-14')

  const [startDate, setStartDate] = useState(defaultDate)
  const [endDate, setEndDate] = useState(defaultDate)
  const [selectedDateIndex, setSelectedDateIndex] = useState(0)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({state: false, message: ''})

  // const [json, setJson] = useState()

  const [production, setProduction] = useState(0);
  const [consumption, setConsumption] = useState(0);
  const [withdrawal, setWithdrawal] = useState(0);
  const [injection, setInjection] = useState(0);

  useEffect(() => {
    if(!isLoading) {
      setIsLoading(true)
      setTimeout(() => {
        fetchDyDate(URL, startDate, endDate)
        .then(json => {
          console.log(json)
          setIsLoading(false)
          if (json.length === 0) {
            setError({
              state: true,
              message: 'Data not available for selected timespan. Try with a different one'
            })
          } else {
            setProduction(getValueFromField(json, 'prod'))
            setConsumption(getValueFromField(json, 'cons'))
            setWithdrawal(getValueFromField(json, 'fromGrid'))
            setInjection(getValueFromField(json, 'toGrid'))
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
  }, [URL, startDate, endDate] )

  const selectTodayValues = () => {
    setStartDate(defaultDate)
    setEndDate(defaultDate)
    setSelectedDateIndex(0)
  }

  const selectWeeklyValues = () => {
    setStartDate(defaultDate.minus({days: 6}))
    setEndDate(defaultDate)
    setSelectedDateIndex(1)
  }

  const selectMonthlyValues = () => {
    setStartDate(defaultDate.set({day: 1}))
    setEndDate(defaultDate)
    setSelectedDateIndex(2)
  }

  const selectLastMonthValues = () => {
    const lastMonth = defaultDate.minus({month: 1})
    setStartDate(lastMonth.set({day: 1}))
    setEndDate(lastMonth.set({day: lastMonth.daysInMonth}))
    setSelectedDateIndex(3)
  }

  return (
    <div className="pt-60 container mx-auto">

      <div className="flex gap-2 mb-3 border-b border-1 py-3">
        <Button onClick={selectTodayValues} selected={selectedDateIndex === 0}>Today</Button>
        <Button onClick={selectWeeklyValues} selected={selectedDateIndex === 1}>This week</Button>
        <Button onClick={selectMonthlyValues} selected={selectedDateIndex === 2}>This month</Button>
        <Button onClick={selectLastMonthValues} selected={selectedDateIndex === 3}>Last month</Button>
      </div>
      <div className="mb-6">
        { startDate.toISODate() !== endDate.toISODate() && 
          <p>Showing values from {startDate.toFormat('MMMM d')} to {endDate.toFormat('MMMM d')}</p>
        }
        { startDate.toISODate() === endDate.toISODate() && <p>Showing today values</p>}
      </div>

      { isLoading && <div>Loading...</div> }

      { (!error.state && !isLoading) &&
        <div>
          <div className="grid grid-cols-2 gap-y-10">
            <DisplayData title="Production" value={production} unit="kWh" />
            <DisplayData title="Consumption" value={consumption} unit="kWh" />
            <DisplayData title="Grid withdrawal" value={withdrawal} unit="kWh" />
            <DisplayData title="Grid injection" value={injection} unit="kWh" />
          </div>
        </div>
      }
      { (!isLoading && error.state) && <ErrorMessage message={error.message} /> }

    </div>
  );
}