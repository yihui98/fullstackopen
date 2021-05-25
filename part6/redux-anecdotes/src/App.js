import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import Anecdotes from './components/Anecdotes'
import Notification from './components/Notification'
import Filter from './components/Filter'

import {initializeAnecdotes} from './reducers/anecdoteReducer'


const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes()) 
  },[dispatch]) 


  return (
    <div>
      <Notification/>
      <h2>Anecdotes</h2>
      <Filter/>
      <Anecdotes/>
      <AnecdoteForm/>
    </div>
  )
}

export default App