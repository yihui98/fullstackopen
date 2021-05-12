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
  const [message, setAddMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const Message = ({message}) => {
    if (message === ''){
      return null
    }
    console.log(message)
    const addMessageStyle = {
      color: 'green',
      background: 'lightgrey',
      fontSize: '25px',
      border: '5px solid rgba(0, 0.05, 0, 0.05)',
      borderColor: 'green',
      padding: '10px',
      margin: '10px'
    }
    return(
      <div style = {addMessageStyle}>
        {message}
      </div>
    )
  }
  const ErrorMessage = ({errorMessage}) => {
    if (errorMessage === ''){
      return null
    }
    const errorMessageStyle = {
      color: 'red',
      background: 'lightgrey',
      fontSize: '25px',
      border: '5px solid rgba(0, 0.05, 0, 0.05)',
      borderColor: 'red',
      padding: '10px',
      margin: '10px'
    }
    return(
      <div style = {errorMessageStyle}>
        {errorMessage}
      </div>
    )
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Message message = {message} setMessage = {setAddMessage} />
      <ErrorMessage errorMessage = {errorMessage} setErrorMessage = {setErrorMessage} />

      <Filter newSearch = {newSearch} setSearch = {setSearch} persons = {persons} />

      <h3>Add a new </h3>

      <PersonForm persons = {persons} setPersons = {setPersons} setMessage = {setErrorMessage}/>   

      <h3>Numbers</h3>

      <Contacts persons = {persons} newSearch = {newSearch} setPersons = {setPersons} setErrorMessage = {setErrorMessage} />
    </div>
  )
}

export default App