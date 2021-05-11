import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Contacts = ({countries, newSearch, setSearch}) => {
  
    const Contact = ({countryToshow, setValue})=>{
      if (countryToShow.length === 1){
        return(
          <Display1 country = {countryToShow[0]}/>
        )
      }
      if (countryToShow.length > 10){
        return (
          <p>Too many matches, specify another fitler</p>
        )
      }
      return(
        <div>
          {countryToShow.map(c =>
            <div key={c.alpha2Code}>
              {c.name}
              <button onClick={() => setValue(c.name)}>
                show
              </button>
            </div>
          )}
        </div>
      )
    }

    const Display1 = ({country}) =>{
      const [weather, setWeather] = useState(null)
      const api_key = '934ad2336fefbea49b971036af9f1053'
      const url = `http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`

      useEffect(() => {
        axios.get(url).then(response => {
          setWeather(response.data.current)
        })
      }, [])

      return(
          <div>
            <h1> {country.name} </h1>
            <p>capital {country.capital}</p>
            <p>population {country.population}</p>
            <h2>languages</h2>
          <ul>
            {country.languages.map(language =>
              <li key= {language.name}>{language.name}</li>
              )}
          </ul>
          <img src= {country.flag} height ="100px" alt = "flag"/>
          <Weather weather = {weather} capital = {country.capital} />
          </div>    
        )
      }
    const Weather =({weather, capital}) =>{
      if (!weather) {
        return null
      }
      return(
        <div>
          <h2>Weather in {capital}</h2>
          <p><strong>temperature: </strong>{weather.temperature} celcius </p>
          <p><img src= {weather.weather_icons[0]} height ="100px" alt = "flag"/></p>
          <p><strong>wind: </strong> {weather.wind_speed} mph direction {weather.wind_dir} </p>
        </div>
      )
    }

    const countryToShow = newSearch === ''
    ? countries
    : countries.filter(country => country.name.includes(newSearch))

    return (
      <div>
        <Contact countryToshow = {countryToShow}
        setValue = {setSearch}/>
      </div>
    )
  }

export default Contacts