import React, { useState } from 'react'

const Blog = ({ blog, handleLikes, handleDelete, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLikes = () => {
    //const newBlog = blog
    //newBlog.likes = blog.likes + 1
    console.log(blog)
    const newBlog = {
      "title": blog.title,
      "author": blog.author,
      "url": blog.url,
      "likes": blog.likes + 1,
      "id": blog.id
    }
    console.log(newBlog)
    handleLikes(newBlog)
  }

  const deleteBlog = () => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (ok){
      handleDelete(blog.id)
    }
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const sameUser = { display: user.id === blog.user.id ? '': 'none' }

  return (
  <div className = 'blog'>
    <div style={hideWhenVisible}>
      <div style = {blogStyle}>
        {blog.title} {blog.author}<button onClick={toggleVisibility}>show</button>
      </div>
    </div>
    <div style={showWhenVisible}>
      <div style={blogStyle}>
        <div>
            <div>
            {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
            </div>
            <div>
            &nbsp;
            {blog.url}
            </div>
            <div>
            &nbsp;Likes: {blog.likes} <button id = 'like' onClick = {addLikes}>like</button>
            </div>
            <div>
            &nbsp;
            {blog.author}
            </div>
            <div style = {sameUser}>
              <button onClick = {deleteBlog}>remove</button>
            </div>
        </div>
      </div>
    </div>
  </div>

)}


export default Blog