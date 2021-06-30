import React, { useEffect, useState } from "react";

const Timezone = () => {
    const[zones, setZones] = useState([]) // All zone data
    const[time, setTime] = useState('') // Time to de displayed
    const[selectedTimeZone, setSelectedTimeZone] = useState('') // Time zone selected from dropdown
    let setIntervalMethod

    useEffect(() => {
        // API call to get all timezones
        fetch('http://api.timezonedb.com/v2.1/list-time-zone?key=XWSLLPX5RMIZ&format=json&zone=Europe/*')
        .then(response=> response.json())
        .then(data => {
            //storing all timezones and storing first timezone to get first timezone data
            setZones(data.zones)
            setSelectedTimeZone(`${data.zones[0].countryName}-${data.zones[0].zoneName}`)
        })
    }, [])

    const timeSelectHandler = props => {
        console.log(props.target.value)
        setSelectedTimeZone(props.target.value)
    }
    function getTimeForLatestTimezone () {
        // method to get time for a selected timezone
        if (selectedTimeZone) {
            let timeZoneForApiCall = selectedTimeZone.split('-')[1].trim()
            fetch('http://api.timezonedb.com/v2/get-time-zone?key=XWSLLPX5RMIZ&format=json&by=zone&zone=' + timeZoneForApiCall)
            .then(res => res.json())
            .then(dataTime => setTime(dataTime.formatted))
        }
    }
    useEffect(() => {
        // get time when dropdown changes and every 5 seconds
        getTimeForLatestTimezone()
        setIntervalMethod = setInterval(() => {
            getTimeForLatestTimezone()
        }, 5000)
        return () => {
            // clean up method to clear the setInterval while changing timezone
            clearInterval(setIntervalMethod)
        }
    }, [selectedTimeZone])
        
 return (
     <div>
         <select value={selectedTimeZone} onChange={timeSelectHandler}>
            {zones.map((zone) => {
                let unquieTimeZone = `${zone.countryName} - ${zone.zoneName}`
                return <option key={unquieTimeZone} value={unquieTimeZone}>{unquieTimeZone}</option>;
            })}
        </select>
        <p>Selected TimeZone: {selectedTimeZone}</p>
        <p>{time ? `Time: ${time}` : ''}</p>

     </div>
 )
}
export default Timezone;