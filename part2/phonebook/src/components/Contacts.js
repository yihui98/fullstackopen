import React from 'react'

const Contacts = ({persons, newSearch}) => {
    const personsToShow = newSearch === ''
    ? persons
    : persons.filter(person => person.name.includes(newSearch))

    const Contact = ({name,number})=>{
        return(
        <p>{name}  {number}</p>
        )}

    return (
      <div>
        {personsToShow.map(person =>
        <Contact key = {person.name} name = {person.name} number = {person.number}/>
      )}
      </div>
    )
  }

export default Contacts