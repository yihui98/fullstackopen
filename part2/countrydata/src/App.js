import React, { useState, useEffect } from 'react'
import Filter from './components/Filter.js'
import Contacts from './components/Contacts.js'
import axios from 'axios'


const App = () => {
  const [countries, setCountries] = useState([])
  const [newSearch, setSearch ] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])
  


  return (
    <div>
      <Filter newSearch = {newSearch} setSearch = {setSearch} countries = {countries} />
      <Contacts countries = {countries} newSearch = {newSearch} setSearch = {setSearch} />
    </div>
  )
}

export default App