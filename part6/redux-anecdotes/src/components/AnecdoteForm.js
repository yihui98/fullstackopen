
import React from 'react'
//import {useDispatch} from 'react-redux'
import {asAnecdote} from '../reducers/anecdoteReducer'
import {addNotification} from '../reducers/notificationReducer'
import {connect} from 'react-redux'

const AnecdoteForm = (props) => {
    //const dispatch = useDispatch()

    const addAncedote = async (event) =>{
        event.preventDefault()
        const content = event.target.ancedote.value
        event.target.ancedote.value = ''
        props.asAnecdote(content)
        props.addNotification("You have added " + content, 5)
    }
        
  return (
  <div>
    <h2>create new</h2>
    <form onSubmit = {addAncedote}>
      <div><input name = "ancedote" /></div>
      <button type = "submit">create</button>
    </form>
  </div>
  )
}

const mapDispatchToProps ={
  asAnecdote,
  addNotification
}

const ConnectedAnecdoteForm = connect(
  null,
  mapDispatchToProps
)(AnecdoteForm)

export default ConnectedAnecdoteForm