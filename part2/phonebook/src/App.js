import React, { useState, useEffect } from 'react'
import Contacts from './components/Contacts.js'
import PersonForm from './components/PersonForm.js'
import Filter from './components/Filter.js'
import axios from 'axios'
import phoneService from './services/phonebook.js'

const App = () => {
  /*
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) */

  const [persons, setPersons] = useState([])
  
  useEffect(() => {
    phoneService
    .getAll()
    .then(initialBook => {
        setPersons(initialBook)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const [newSearch, setSearch ] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter newSearch = {newSearch} setSearch = {setSearch} persons = {persons} />

      <h3>Add a new </h3>

      <PersonForm persons = {persons} setPersons = {setPersons} />   

      <h3>Numbers</h3>

      <Contacts persons = {persons} newSearch = {newSearch} setPersons = {setPersons} />
    </div>
  )
}

export default App