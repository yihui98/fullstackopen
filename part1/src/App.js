import React, { useDebugValue } from 'react'

const Header = (props) => {
  return (
    <div>
      <h1>{props.title}</h1>
    </div>
  )
}
const Part = (props) => {
  return (
    <div>
      <p>
        {props.part}: {props.exercises}
      </p> 
    </div>
  )
}

const Content = (props) => {
  return(
   <div>
    <p>
      <Part part = {props.array[0].name} exercises = {props.array[0].exercises} />
    </p>
    <p>
      <Part part = {props.array[1].name} exercises = {props.array[1].exercises} />
    </p>
    <p>
      <Part part = {props.array[2].name} exercises = {props.array[2].exercises} />
    </p>
  </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>
        Number of exercises: {props.array[0].exercises + props.array[1].exercises + props.array[2].exercises}
      </p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header title = {course.name} />
      <Content array = {course.parts}/>
      <Total array = {course.parts} />
      
    </div>
  )
}

export default App