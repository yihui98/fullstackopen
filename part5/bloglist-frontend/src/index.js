import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'
import blogService from './services/blogs'
import { BrowserRouter as Router } from 'react-router-dom'

blogService.getAll().then(blogs =>
    blogs.forEach(blog => {
      store.dispatch({
        type:"ADD",
        data: blog
      })
    }))

ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    document.getElementById('root')
    )