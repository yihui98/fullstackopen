import React from 'react'
import { addLikes, deleteBlog as handleDelete, addComments } from '../reducers/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { Table, Button } from 'react-bootstrap'


const Comments = ({ comments, handleComments }) => {


  const addComment = async (event) => {
    event.preventDefault()
    handleComments(event.target.comment.value)
    event.target.comment.value = ''
  }
  return(
    <div>
      <h3> comments </h3>
      <form onSubmit = {addComment}>
        <input name ="comment" type = "string" />
        <button type = "submit"> add comment </button>
      </form>
      {comments.map((comment, id ) =>
        <div key = {id}> {comment} </div>
          )}
    </div>
  )
}


const Blog = ({ user }) => {
  const id = useParams().id
  const blogs = useSelector(state => state.blog)
  console.log()

  const blog = blogs.find(n => n.id === id)
  if (!blogs || !blog){
    return null
  }

  const dispatch = useDispatch()

  const deleteBlog = () => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (ok){
      dispatch(handleDelete(blog.id))
    }
  }

  const handleLikes = (blog) => {
    dispatch(addLikes(blog))
  }
  const handleComments = (comment) => {
    dispatch(addComments(comment, blog ))
  }

  var sameUser = null
  if (user && blog.user){
    sameUser = { display: user.id === blog.user.id ? '': 'none' }
  }


  return (
    <div className = 'blog'>
              <Table size = "sm">
                <tbody>
                <tr>
                  <td>Title:</td>
                  <td>{blog.title}</td>
                </tr>
                <tr>
                  <td>Author:</td>
                  <td>{blog.author}</td>
                </tr>
                <tr>
                  <td>Link:</td>
                  <td><Link to = {blog.url}>{blog.url}</Link></td>
                </tr>
                <tr>
                  <td>Likes:</td>
                  <td>{blog.likes} <Button class="btn btn-primary btn-sm" id = 'like' onClick = {() => handleLikes(blog)}>like</Button></td>
                </tr>
                </tbody>
                <div style = {sameUser}>
                <Button class="btn btn-danger btn-sm" onClick = {deleteBlog}>remove</Button>
              </div>
              <div>
                <Comments comments = {blog.comments} handleComments= {handleComments} />
              </div>
              </Table>
    </div>

)}


export default Blog