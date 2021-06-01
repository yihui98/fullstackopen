import React, { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import blogService from './services/blogs'
import Notification from './components/Notification'
import Blog from './components/Blog'
import Users from './components/Users'
import User from './components/User'
import loginService from './services/login'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, createBlog } from "./reducers/blogs"
import { positiveMessage, negativeMessage } from "./reducers/notifications"
import { login, logout } from "./reducers/user"
import { initializeUsers } from "./reducers/users"
import {
  BrowserRouter as Router,
  Switch, Route, Link } from 'react-router-dom'
import { Nav, Navbar, Form, Button } from 'react-bootstrap'



const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs()),
    dispatch(initializeUsers())
  },[dispatch])

  const users = useSelector(state => state.users)

  //const loggedUserJSON = useSelector(state => state.user)
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username , password)
    try {
      const user = await loginService.login({
        username, password
      })
      login(user)
      setUser(user)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(negativeMessage("Wrong Credentials"))
      console.log("Wrong credentials")
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    //window.localStorage.clear()
    logout()
  }

  const addBlog = (blogObject) => {
    if (blogObject.title === ''){
      dispatch(negativeMessage("Missing title"))
    } else if (blogObject.url === ''){
      dispatch(negativeMessage("Missing URL"))
    } else {
        dispatch(createBlog(blogObject))
        dispatch(positiveMessage(`a new blog ${blogObject.title} by ${blogObject.author} is added`))
    }
  }

  if (user === null) {
    return (
      <div className = "container">
      <Notification/>
        <h2>Log in to application</h2>
        <Form onSubmit = {handleLogin}>
        <Form.Group>
         <Form.Label> username: </Form.Label>
            <Form.Control
            id = "username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
          <Form.Label>password:</Form.Label>
            <Form.Control
            id = "password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        <Button variant = "primary" id = "login-button" type="submit">login</Button>
        </Form.Group>
      </Form>
    </div>
    )
  }
  const padding = {
    padding: 5
  }

  return (
    <div className = "container">
      <Notification/>
      <Router>
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#" as="span">
                <Link style = {padding} to ="/"> blogs</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link style = {padding} to = "/users">users</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
              {user.name} is logged in
            </Nav.Link>
            </Nav>
          </Navbar.Collapse>
    </Navbar>
        <h2>blogs</h2>
          <div>
          <button onClick = {handleLogout}> Log out </button>
          </div>
        <Switch>
          <Route path = "/blogs/:id">
            <Blog user = {user}/>
          </Route>
          <Route path = "/users/:id">
            <User users = {users}/>
          </Route>
          <Route path = "/users">
            <Users/>
          </Route>
          <Route path = "/">
            <Blogs addBlog = {addBlog}/>
          </Route>
        </Switch>
      </Router>
</div>
  )
}

export default App