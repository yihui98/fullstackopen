
/*
//Example from Part2 - phonebook
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const [persons, setPersons] = useState([]) //set the state
  
useEffect(() => {
  console.log('effect')
  axios
    .get('http://localhost:3001/persons') #retrieve data from a server
    .then(response => {
      console.log('promise fulfilled')
      setPersons(response.data) #
    })
}, []) #Second parameter of useEffect is used to specify how often the effect is run. If []. then effect
        is only run along with the render of the components


 axios
    .post('http://localhost:3001/notes', noteObject) //Add data to server
    .then(response => {
      console.log(response)
      setNotes(notes.concat(noteObject))
      setNewNote('')
    })
  
//Changing a variable in an array on the server
  const toggleImportanceOf = id => {
    const url = `http://localhost:3001/notes/${id}` //id is unique
    const note = notes.find(n => n.id === id) //find the note
    const changedNote = { ...note, important: !note.important } 
    //create new note and change the value
  
    axios.put(url, changedNote).then(response => {
      //look up every individual note and keep if same
      setNotes(notes.map(note => note.id !== id ? note : response.data))
    })
  }

//newer version of defining an object with 2 variables   
const person = {
  name: name,
  age: age
} <-older version
const person = {name, age}  

*/

