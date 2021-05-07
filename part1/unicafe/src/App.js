import React, { useState } from 'react'


const Button = ({ handleClick, text }) => (
  <button cssclass = 'e-round' onClick={handleClick}>
    {text}
  </button>
)

const Statistics = ({good, neutral,bad}) =>{
  const total = (good+bad+neutral)
  const average = ((good -bad)/total).toPrecision(2)
  const positive = (good*100/total).toPrecision(3)

  if (good === 0 && neutral === 0 && bad === 0){
    return(
      <div>
      <p>No feedback given</p>
      </div>
    )
  }

  return(
    <div>
      <h1>statistics</h1>

      <table>
        <tbody>
          <tr>
            <td> good </td>
            <td>{good}</td>
          </tr>
          <tr>
            <td> neutral</td>
            <td>{neutral}</td>
          </tr>
          <tr>
            <td> bad</td>
            <td>{bad}</td>
          </tr>
          <tr>
            <td> all</td>
            <td>{total}</td>
          </tr>
          <tr>
            <td> average</td>
            <td>{average}</td>
          </tr>
          <tr>
            <td> positive</td>
            <td>{positive} %</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }



  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />
      <Statistics good = {good} neutral = {neutral} bad ={bad}/>

    </div>
  )
}

export default App