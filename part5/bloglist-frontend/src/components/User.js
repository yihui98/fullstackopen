import React from 'react'
import { useParams } from 'react-router-dom'


const User =  ({ users }) => {
    const id = useParams().id
    const user = users.find(n => n.id === id)
    if (!user){
        return null
    }
    return (
      <div>
          <h3> {user.name} </h3>
          <h4> added blogs</h4>
          <ul>
          {user.blogs.map(blog =>
          <li key = {blog.id}> {blog.title} </li>
          )}
          </ul>
      </div>
)}

export default User