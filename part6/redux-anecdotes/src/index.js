import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'
import anecdoteService from './services/anecdotes'

anecdoteService.getAll().then(anecdotes =>
  anecdotes.forEach(anecdote =>{
    store.dispatch({
      type:"ADD",
      data: anecdote
    })
  }))

//console.log(store.getState())

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)