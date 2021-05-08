import React from 'react'
import Header from './Header.js'
import Content from './Content.js'

const Course = ({courses}) => {

    const Total = ({ course }) => {
        let initialValue = 0
        const sum = course.parts.reduce(function(accumulator, currentValue){
          return accumulator + currentValue.exercises
        }, initialValue)
        return(
          <h3>total of {sum} exercises </h3>
        ) 
      }
  

  const Curriculum = ({course}) =>{
    return(
      <div>
    <Header course={course} />
    <Content course = {course}/>
    <Total course = {course}/>
    </div>
    )}

  return (
      <div>
        <h1>Web development curriculum</h1>
        {courses.map(course1 =>
        <Curriculum key = {course1.id} course={course1} />
        )}
      </div>
  )
}

export default Course