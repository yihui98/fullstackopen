import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from "react-router-dom"
import Togglable from '../components/Togglable'
import BlogForm from '../components/BlogForm'


const Blogs = ({ addBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blogs = useSelector(state => state.blog)
  console.log(blogs)

  return (
    <div>
      <div>
            &nbsp;
            <Togglable buttonLabel = 'Create new blog' endLabel = "cancel">
              <BlogForm createBlog = {addBlog} />
            </Togglable>
      </div>
          <div>
            {blogs.map(blog =>
            <div style = {blogStyle} key = {blog.id }><Link key = {blog.id} to = {`/blogs/${blog.id}`} > {blog.title} </Link></div>
            )}
          </div>
    </div>
)}


export default Blogs