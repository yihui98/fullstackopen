import React, { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button cssclass = 'e-round' onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]

  const array = new Array(anecdotes.length+1).join('0').split('').map(parseFloat) //Create an array with 0s
  const [selected, setSelected] = useState(0)
  const [vote, setVotes] = useState(array)
  
  const handleNext= () => {
    const num = Math.floor(Math.random()*anecdotes.length)
    setSelected(num)    
  }

  const handleVotes= () => {
    const copy = [...vote]
    copy[selected] += 1
    setVotes(copy)
  }

  function largestIndex(array){
    var counter = 1;
    var max = 0;
  
    for(counter; counter < array.length; counter++){
      if(array[max] < array[counter]){
          max = counter;
      }
    }
    return max;
  }
  
  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <p>has {vote[selected]} votes</p>
      <p><Button handleClick = {handleVotes} text = "vote"/>
        <Button handleClick = {handleNext} text = "next ancedote"/></p>
      <h1> Ancedote with most votes </h1>
      {anecdotes[largestIndex(vote)]}
      <p>has {vote[largestIndex(vote)]} votes</p>
    </div>
  )
}

export default App