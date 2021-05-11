import React from 'react'
import Part from './content/Part.js'

const Content = ({ course }) => {
    return (
      <div>
        {course.parts.map(coursePart =>
          <Part key = {coursePart.id} part = {coursePart}/>
          )}
      </div>
    )
  }

export default Content