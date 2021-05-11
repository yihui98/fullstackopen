import React from 'react'
import phoneService from '../services/phonebook.js'

const Contacts = ({persons, newSearch, setPersons}) => {
    const personsToShow = newSearch === ''
    ? persons
    : persons.filter(person => person.name.includes(newSearch))

    const Contact = ({name,number, toggleDelete})=>{
        return(
          
        <li>
          {name}  {number}
        <button onClick={toggleDelete}>Delete</button>
        </li>
        )}
    
    const toggleDeleteOf = id => {
    const person = persons.find(n => n.id === id)
    console.log(person)

    const ok = window.confirm(`Delete ${person.name} ?`)
    
    if (ok){
      phoneService
      .deleteContact(id)
      .then(allBook => {
      setPersons(persons.filter(p => p.id !== id))})
      .catch(error => {
        alert(
          `the contact '${person.name}' was already deleted from server`
        )
        setPersons(persons.filter(n => n.id !== id-1)) //filster out deleted note
      }) 
    }
  }

    return (
      <div>
        {personsToShow.map(person =>
        <Contact key = {person.name}
         name = {person.name}
          number = {person.number}
          toggleDelete={() => toggleDeleteOf(person.id)}/>
      )}
      </div>
    )
  }

export default Contacts