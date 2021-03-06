import React, { useState } from 'react'
import axios from 'axios'
import phoneService from '../services/phonebook.js'


const PersonForm = ({persons, setPersons, setErrorMessage}) => {
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')

  const addName = (event) => {
    event.preventDefault()
    console.log('button clicked',event.target)

    const allNames = []
    persons.map(person =>
      allNames.push(person.name)
    )

    if (allNames.includes(newName)){
      const person = persons.find(n => n.name === newName)
      const ok = window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)
      if (ok){
        const changedNumber = { ...person, number: newNumber }
        phoneService
        .update(person.id, changedNumber)
        .then(returnedNumber => {
        setPersons(persons.map(person => person.name !== newName ? person : returnedNumber))
        setNewName('')
        setNewNumber('')
    })
        }
    }
    else{
    phoneService.create({
      name: newName,
      number: newNumber
    }).then(returnedBook=> {
      setPersons(persons.concat(returnedBook))
      setNewName('')
      setNewNumber('')
    }).catch(error =>{
      setErrorMessage(error.response.data.error)
      console.log(error.response.data)
    })
  } 
}

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

    return (
        <div>
            <form  onSubmit = {addName}>
                <div> name: <input  value = {newName} onChange = {handleNameChange}/> </div>
                <div> number: <input value = {newNumber} onChange = {handleNumberChange} /></div>
                <div> <button type="submit">add</button> </div>
            </form>   
        </div>
    )
  }

export default PersonForm