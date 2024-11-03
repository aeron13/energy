import { useEffect } from "react";
import DisplayData from "./components/DisplayData"; 
import { useState } from "react";
import { DateTime } from "luxon";
import useFetchDyDate from "./hooks/useFetchByDate";

// const defaultDate = new Date('2024-10-16')

const getValueFromField = (array, field) => {
  const initialValue = array[0][field]
  return Math.floor(array.reduce((sum, current) => {
    if (current[field]) return sum + current[field]
    return sum
  }, initialValue ))
}


function App() {

  const URL = process.env.REACT_APP_URL
  const startDate = DateTime.fromISO('2024-10-12')
  const endDate = DateTime.fromISO('2024-10-16')

  const [production, setProduction] = useState(0);
  const [consumption, setConsumption] = useState(0);
  const [withdrawal, setWithdrawal] = useState(0);
  const [injection, setInjection] = useState(0);

  const [json] = useFetchDyDate(URL, startDate, endDate)

  useEffect(() => {
    if (!json || json.length === 0) return
    setProduction(getValueFromField(json, 'prod'))
    setConsumption(getValueFromField(json, 'cons'))
    setWithdrawal(getValueFromField(json, 'fromGrid'))
    setInjection(getValueFromField(json, 'toGrid'))

  }, [json])

  return (
    <div className="pt-60 container mx-auto">
      
      <div className="grid grid-cols-2 gap-y-10">
        <DisplayData title="Production" value={production} unit="kW/h" />
        <DisplayData title="Consumption" value={consumption} unit="kW/h" />
        <DisplayData title="Grid withdrawal" value={withdrawal} unit="kW/h" />
        <DisplayData title="Grid injection" value={injection} unit="kW/h" />
      </div>

    </div>
  );
}

export default App;
