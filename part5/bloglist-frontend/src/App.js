import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [message, setMessage] = useState(null)
  const [positive, setPositive] = useState(true)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort(function (a,b){
        return b.likes - a.likes
      }))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username , password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setPositive(false)
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      console.log("Wrong credentials")
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = (blogObject) => {
    if (blogObject.title === ''){
      setPositive(false)
      setMessage("Title missing")
      setTimeout(() => {
        setMessage(null)
      }, 5000)

    } else if (blogObject.url === ''){
      setPositive(false)
      setMessage("URL missing")
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } else {
        blogService.create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
        })
        setPositive(true)
        setMessage(`a new blog ${blogObject.title} by ${blogObject.author} is added`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
    }
  }

  const addLikes = (blogObject) => {
   blogService.increaseLikes(blogObject)
   blogService.getAll().then(blogs =>
    setBlogs(blogs.sort(function (a,b){
      return b.likes - a.likes
    }))
  )
  }
  const deleteBlog = (id) => {
    blogService.deleteBlog(id)

    function findBlog(){
      return blogs.id === id
    }
    const index = blogs.findIndex(findBlog)
    blogs.splice(index,1)
    setBlogs(blogs)
  }

  if (user === null) {
    return (
      <div>
      <Notification message = {message} positive = {positive} />
        <h2>Log in to application</h2>
        <form onSubmit = {handleLogin}>
        <div>
          username
            <input
            id = "username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            id = "password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id = "login-button" type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification id = "notification" message = {message} positive = {positive} />
      <h2>blogs</h2>
      <div>
      {user.name} is logged in
      <button onClick = {handleLogout}> Log out </button>
      </div>
      <div>
        &nbsp;
        <Togglable buttonLabel = 'Create new blog' endLabel = "cancel">
          <BlogForm createBlog = {addBlog} />
        </Togglable>
      </div>
        &nbsp;

        {blogs.map(blog =>
                  <Blog key={blog.id} blog={blog} handleLikes = {addLikes} handleDelete = {deleteBlog} user = {user}/>
      )}
    </div>
  )
}

export default App