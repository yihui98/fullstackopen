
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {vote} from '../reducers/anecdoteReducer'
import {addNotification} from '../reducers/notificationReducer'

const Anecdotes = (props) => {
    const anecdotes = useSelector(state => {
      if (state.filter === ''){
        return state.anecdote
      }
      return state.anecdote.filter(anec => anec.content.toLowerCase().indexOf(state.filter.toLowerCase()) !== -1)
      })
    anecdotes.sort(function (a,b){
      return b.votes - a.votes})
    const dispatch = useDispatch()

    const toggleVote = async (anecdote) =>{
        dispatch(vote(anecdote))
        dispatch(addNotification("You have voted for " + anecdote.content, 5))
      }
        
  return (
    <div>
      
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => toggleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Anecdotes