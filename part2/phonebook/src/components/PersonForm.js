import React, { useState } from 'react'

const PersonForm = ({persons, setPersons}) => {
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
      return(
      alert(`${newName} is already added to phonebook`)
      )
    }
    
    const nameObject = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
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